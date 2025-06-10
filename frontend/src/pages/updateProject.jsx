import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { FiUpload, FiX } from 'react-icons/fi';
import * as Yup from 'yup';
import axios from 'axios';

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
    techStack: Yup.string()
        .min(1, 'Select at least one tech stack')
        .required('Tech stack is required'),
});

const UpdateProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Fetch existing project data
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/project/get/${id}`);
                setProject(response.data);
                setInitialLoading(false);
            } catch (error) {
                console.error('Error fetching project:', error);
                alert('Failed to fetch project details');
                navigate('/manage-projects');
            }
        };

        fetchProject();
    }, [id, navigate]);

    const uploadToCloudinary = async (files) => {
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
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

                return response.data.secure_url;
            });

            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setLoading(true);

            // Handle new image uploads
            const newImageUrls = values.newImages?.length > 0 
                ? await uploadToCloudinary(values.newImages)
                : [];

            // Handle new video uploads
            const newVideoUrls = values.newVideos?.length > 0
                ? await uploadToCloudinary(values.newVideos)
                : [];

            const projectData = {
                ...values,
                images: [...(values.existingImages || []), ...newImageUrls],
                videos: [...(values.existingVideos || []), ...newVideoUrls],
            };

            const response = await axios.put(`http://localhost:5000/project/update/${id}`, projectData);

            if (response.data) {
                alert('Project updated successfully!');
                navigate('/manage-projects');
            }
        } catch (error) {
            console.error('Error details:', error);
            alert('Failed to update project. Please try again.');
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const handleFileChange = (e, type, setFieldValue) => {
        const newFiles = Array.from(e.target.files);
        if (type === 'images') {
            const updatedImages = [...selectedImages, ...newFiles];
            setSelectedImages(updatedImages);
            setFieldValue('newImages', updatedImages);
        } else {
            const updatedVideos = [...selectedVideos, ...newFiles];
            setSelectedVideos(updatedVideos);
            setFieldValue('newVideos', updatedVideos);
        }
    };

    const handleRemoveExistingFile = (type, index, setFieldValue, values) => {
        if (type === 'image') {
            const updatedImages = values.existingImages.filter((_, i) => i !== index);
            setFieldValue('existingImages', updatedImages);
        } else {
            const updatedVideos = values.existingVideos.filter((_, i) => i !== index);
            setFieldValue('existingVideos', updatedVideos);
        }
    };

    if (initialLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-[#E5E3D4] text-xl">Loading project details...</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto border-2 border-gray-600 bg-[#252525] rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#1b1b1b] py-6">
                    <h2 className="text-center text-3xl font-bold text-[#F1EFEC]">
                        Update Project
                    </h2>
                </div>

                <Formik
                    initialValues={{
                        title: project?.title || '',
                        description: project?.description || '',
                        type: project?.type || '',
                        area: project?.area || '',
                        githubLink: project?.githubLink || '',
                        liveLink: project?.liveLink || '',
                        techStack: project?.techStack || '',
                        existingImages: project?.images || [],
                        existingVideos: project?.videos || [],
                        newImages: [],
                        newVideos: []
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, setFieldValue, values }) => (
                        <Form className="p-8 space-y-6 bg-[#252525]">
                            {/* Title */}
                            <div>
                                <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                    Project Title
                                </label>
                                <Field
                                    name="title"
                                    className="w-full px-4 py-2 rounded-lg border bg-[#333333] text-[#E5E3D4] focus:outline-none focus:border-[#9ABF80]"
                                    placeholder="Enter project title"
                                />
                                {errors.title && touched.title && (
                                    <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                    Description
                                </label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    rows="4"
                                    className="w-full px-4 py-2 rounded-lg border bg-[#333333] text-[#E5E3D4] focus:outline-none focus:border-[#9ABF80]"
                                    placeholder="Describe your project"
                                />
                                {errors.description && touched.description && (
                                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                                )}
                            </div>

                            {/* Project Type */}
                            <div>
                                <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                    Project Type
                                </label>
                                <Field
                                    as="select"
                                    name="type"
                                    className="w-full px-4 py-2 rounded-lg border bg-[#333333] text-[#E5E3D4] focus:outline-none focus:border-[#9ABF80]"
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
                                <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                    Project Area
                                </label>
                                <Field
                                    name="area"
                                    className="w-full px-4 py-2 rounded-lg border bg-[#333333] text-[#E5E3D4] focus:outline-none focus:border-[#9ABF80]"
                                    placeholder="e.g., Frontend, Backend, Full Stack"
                                />
                                {errors.area && touched.area && (
                                    <div className="text-red-500 text-sm mt-1">{errors.area}</div>
                                )}
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                        GitHub Link
                                    </label>
                                    <Field
                                        name="githubLink"
                                        className="w-full px-4 py-2 rounded-lg border bg-[#333333] text-[#E5E3D4] focus:outline-none focus:border-[#9ABF80]"
                                        placeholder="GitHub repository URL"
                                    />
                                    {errors.githubLink && touched.githubLink && (
                                        <div className="text-red-500 text-sm mt-1">{errors.githubLink}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                        Live Link
                                    </label>
                                    <Field
                                        name="liveLink"
                                        className="w-full px-4 py-2 rounded-lg border bg-[#333333] text-[#E5E3D4] focus:outline-none focus:border-[#9ABF80]"
                                        placeholder="Live project URL"
                                    />
                                    {errors.liveLink && touched.liveLink && (
                                        <div className="text-red-500 text-sm mt-1">{errors.liveLink}</div>
                                    )}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="form-group">
                                <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                    Tech Stack
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {techStackOptions.map(tech => (
                                        <button
                                            key={tech}
                                            type="button"
                                            onClick={() => {
                                                const newTechStack = values.techStack?.includes(tech)
                                                    ? values.techStack.filter(t => t !== tech)
                                                    : [...(values.techStack || []), tech];
                                                setFieldValue('techStack', newTechStack);
                                            }}
                                            className={`px-3 py-1 rounded-full text-sm transition-all duration-300 
                                                        ${values.techStack?.includes(tech)
                                                            ? 'bg-[#9ABF80] text-black'
                                                            : 'bg-[#6A669D]/20 text-[#E5E3D4] hover:bg-[#6A669D]/30'
                                                        }`}
                                        >
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* File Uploads */}
                            <div className="space-y-4">
                                {/* Existing Images */}
                                <div>
                                    <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                        Existing Project Images
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {values.existingImages.length > 0 ? (
                                            values.existingImages.map((image, index) => (
                                                <div key={index} className="relative group bg-[#D4C9BE] rounded-lg p-1">
                                                    <div className="relative w-16 h-16">
                                                        <img 
                                                            src={image}
                                                            alt="Existing Project"
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingFile('image', index, setFieldValue, values)}
                                                        className="absolute -top-1 -right-1 bg-[#123458] text-white rounded-full p-1 
                                                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    >
                                                        <FiX size={12} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-sm text-[#123458] font-medium">
                                                No existing images
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* New Images Upload */}
                                <div>
                                    <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                        Upload New Project Images
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

                                {/* Existing Videos */}
                                <div>
                                    <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                        Existing Project Videos
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {values.existingVideos.length > 0 ? (
                                            values.existingVideos.map((video, index) => (
                                                <div key={index} className="relative group bg-[#D4C9BE] rounded-lg p-1">
                                                    <div className="w-16 h-16">
                                                        <video 
                                                            src={video}
                                                            className="w-full h-full object-cover rounded-lg"
                                                            controls
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingFile('video', index, setFieldValue, values)}
                                                        className="absolute -top-1 -right-1 bg-[#123458] text-white rounded-full p-1 
                                                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    >
                                                        <FiX size={12} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-sm text-[#123458] font-medium">
                                                No existing videos
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* New Videos Upload */}
                                <div>
                                    <label className="block text-[#E5E3D4] text-sm font-semibold mb-2">
                                        Upload New Project Videos
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