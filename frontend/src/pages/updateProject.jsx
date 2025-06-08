import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { FiUpload, FiX } from 'react-icons/fi';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    title: Yup.string()
        .required('Project title is required')
        .min(3, 'Title must be at least 3 characters'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
    type: Yup.string()
        .required('Project type is required'),
    area: Yup.string()
        .required('Project area is required'),
    githubLink: Yup.string()
        .url('Must be a valid URL')
        .required('GitHub link is required'),
    liveLink: Yup.string()
        .url('Must be a valid URL'),
});

const UpdateProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const projectTypes = [
        'Web Development',
        'Mobile App',
        'UI/UX Design',
        'Machine Learning',
        'Data Science',
        'Other'
    ];

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/project/get/${id}`);
            setProject(response.data);
            setSelectedImages(response.data.images || []);
            setSelectedVideos(response.data.videos || []);
            setInitialLoading(false);
        } catch (error) {
            toast.error('Failed to fetch project');
            navigate('/manage-projects');
        }
    };

    const handleFileChange = (e, type, setFieldValue) => {
        const files = Array.from(e.target.files);
        if (type === 'images') {
            setSelectedImages(prev => [...prev, ...files]);
            setFieldValue('images', [...selectedImages, ...files]);
        } else {
            setSelectedVideos(prev => [...prev, ...files]);
            setFieldValue('videos', [...selectedVideos, ...files]);
        }
    };

    const renderFilePreview = (files, type, setFieldValue) => {
        const MAX_PREVIEW = 3;
        const totalFiles = files.length;
        const filesToShow = files.slice(0, MAX_PREVIEW);
        
        const handleRemove = (index) => {
            const newFiles = files.filter((_, i) => i !== index);
            if (type === 'image') {
                setSelectedImages(newFiles);
                setFieldValue('images', newFiles);
            } else {
                setSelectedVideos(newFiles);
                setFieldValue('videos', newFiles);
            }
        };
        
        return (
            <div className="flex flex-wrap items-center gap-2 mt-2">
                {filesToShow.map((file, index) => (
                    <div key={index} className="relative group bg-[#D4C9BE] rounded-lg p-1">
                        {type === 'image' && (
                            <div className="relative w-16 h-16">
                                <img 
                                    src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        )}
                        {type === 'video' && (
                            <div className="w-16 h-16">
                                <video 
                                    src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute -top-1 -right-1 bg-[#123458] text-white rounded-full p-1 
                                     opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <FiX size={12} />
                        </button>
                    </div>
                ))}
                {totalFiles > MAX_PREVIEW && (
                    <div className="flex items-center justify-center bg-[#D4C9BE] rounded-lg p-2">
                        <span className="text-sm text-[#123458] font-medium">
                            +{totalFiles - MAX_PREVIEW} more
                        </span>
                    </div>
                )}
                <div className="ml-2 text-sm text-[#030303]">
                    {totalFiles} {type}{totalFiles > 1 ? 's' : ''} selected
                </div>
            </div>
        );
    };

    const uploadToCloudinary = async (files) => {
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                
                if (typeof file === 'string') return file;

                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
                formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

                const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (response.data && response.data.secure_url) {
                    return response.data.secure_url;
                } else {
                    throw new Error('Upload failed: No secure URL received');
                }
            });

            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-[#F1EFEC] flex items-center justify-center">
                <div className="text-[#123458] text-xl">Loading project...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#F1EFEC] flex items-center justify-center">
                <div className="text-[#123458] text-xl">Project not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1EFEC] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#123458] py-6">
                    <h2 className="text-center text-3xl font-bold text-[#F1EFEC]">
                        Update Project
                    </h2>
                </div>

                <Formik
                    initialValues={{
                        title: project.title || '',
                        description: project.description || '',
                        type: project.type || '',
                        area: project.area || '',
                        githubLink: project.githubLink || '',
                        liveLink: project.liveLink || '',
                        images: project.images || [],
                        videos: project.videos || []
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            setLoading(true);

                            // Upload new images
                            const imageUrls = await uploadToCloudinary(values.images);
                            const videoUrls = await uploadToCloudinary(values.videos);

                            const updatedValues = {
                                ...values,
                                images: imageUrls,
                                videos: videoUrls
                            };

                            const response = await axios.put(
                                `http://localhost:5000/project/update/${id}`, 
                                updatedValues
                            );

                            if (response.data) {
                                toast.success('Project updated successfully!');
                                navigate('/manage-projects');
                            }
                        } catch (error) {
                            console.error('Update error:', error);
                            toast.error('Failed to update project');
                        } finally {
                            setLoading(false);
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <Form className="p-8 space-y-6 bg-white">
                            {/* Title */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    Project Title
                                </label>
                                <Field
                                    name="title"
                                    className="w-full px-4 py-2 rounded-lg border bg-[#E2F0CB] focus:outline-none focus:border-[#A7D2CB]"
                                    placeholder="Enter project title"
                                />
                                {errors.title && touched.title && (
                                    <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    Description
                                </label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    rows="4"
                                    className="w-full px-4 py-2 rounded-lg border bg-[#E2F0CB] focus:outline-none focus:border-[#A7D2CB]"
                                    placeholder="Describe your project"
                                />
                                {errors.description && touched.description && (
                                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                                )}
                            </div>

                            {/* Project Type */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    Project Type
                                </label>
                                <Field
                                    as="select"
                                    name="type"
                                    className="w-full px-4 py-2 rounded-lg border bg-[#E2F0CB] focus:outline-none focus:border-[#A7D2CB]"
                                >
                                    <option value="">Select Type</option>
                                    {projectTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </Field>
                                {errors.type && touched.type && (
                                    <div className="text-red-500 text-sm mt-1">{errors.type}</div>
                                )}
                            </div>

                            {/* Area */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    Project Area
                                </label>
                                <Field
                                    name="area"
                                    className="w-full px-4 py-2 rounded-lg border bg-[#E2F0CB] focus:outline-none focus:border-[#A7D2CB]"
                                    placeholder="e.g., Frontend, Backend, Full Stack"
                                />
                                {errors.area && touched.area && (
                                    <div className="text-red-500 text-sm mt-1">{errors.area}</div>
                                )}
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        GitHub Link
                                    </label>
                                    <Field
                                        name="githubLink"
                                        className="w-full px-4 py-2 rounded-lg border bg-[#E2F0CB] focus:outline-none focus:border-[#A7D2CB]"
                                        placeholder="GitHub repository URL"
                                    />
                                    {errors.githubLink && touched.githubLink && (
                                        <div className="text-red-500 text-sm mt-1">{errors.githubLink}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Live Link
                                    </label>
                                    <Field
                                        name="liveLink"
                                        className="w-full px-4 py-2 rounded-lg border bg-[#E2F0CB] focus:outline-none focus:border-[#A7D2CB]"
                                        placeholder="Live project URL"
                                    />
                                    {errors.liveLink && touched.liveLink && (
                                        <div className="text-red-500 text-sm mt-1">{errors.liveLink}</div>
                                    )}
                                </div>
                            </div>

                            {/* File Uploads */}
                            <div className="space-y-4">
                                {/* Images Upload */}
                                <div>
                                    <label className="block text-[#030303] text-sm font-semibold mb-2">
                                        Project Images
                                    </label>
                                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
                                                  rounded-lg bg-[#F1EFEC] border-[#D4C9BE]">
                                        <div className="space-y-1 text-center">
                                            <FiUpload className="mx-auto h-12 w-12 text-[#123458]" />
                                            <div className="flex text-sm text-[#030303]">
                                                <label className="relative cursor-pointer bg-[#123458] px-4 py-2 
                                                                rounded-md font-medium text-[#F1EFEC] 
                                                                hover:bg-opacity-90">
                                                    <span>Upload images</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={(e) => handleFileChange(e, 'images', setFieldValue)}
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-[#030303]">PNG, JPG, GIF up to 10MB each</p>
                                        </div>
                                    </div>
                                    {selectedImages.length > 0 && renderFilePreview(selectedImages, 'image', setFieldValue)}
                                </div>

                                {/* Videos Upload */}
                                <div>
                                    <label className="block text-[#030303] text-sm font-semibold mb-2">
                                        Project Videos
                                    </label>
                                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
                                                  rounded-lg bg-[#F1EFEC] border-[#D4C9BE]">
                                        <div className="space-y-1 text-center">
                                            <FiUpload className="mx-auto h-12 w-12 text-[#123458]" />
                                            <div className="flex text-sm text-[#030303]">
                                                <label className="relative cursor-pointer bg-[#123458] px-4 py-2 
                                                                rounded-md font-medium text-[#F1EFEC] 
                                                                hover:bg-opacity-90">
                                                    <span>Upload videos</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="video/*"
                                                        className="sr-only"
                                                        onChange={(e) => handleFileChange(e, 'videos', setFieldValue)}
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-[#030303]">MP4, WebM up to 50MB each</p>
                                        </div>
                                    </div>
                                    {selectedVideos.length > 0 && renderFilePreview(selectedVideos, 'video', setFieldValue)}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full px-4 py-3 ${
                                        loading ? 'bg-opacity-70' : ''
                                    } bg-[#123458] text-[#F1EFEC] rounded-lg hover:bg-opacity-90 
                                    transition-colors duration-300 font-semibold shadow-md`}
                                >
                                    {loading ? 'Updating Project...' : 'Update Project'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default UpdateProject;