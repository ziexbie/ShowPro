import React, { useState } from 'react';
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
    images: Yup.array()
        .of(Yup.mixed())
        .nullable(),
    videos: Yup.array()
        .of(Yup.mixed())
        .nullable(),
    techStack: Yup.string()
        .min(1, 'Select at least one tech stack')
        .required('Tech stack is required'),
    
});

const AddProject = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [loading, setLoading] = useState(false);

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

                if (response.data && response.data.secure_url) {
                    console.log('Upload successful:', response.data.secure_url);
                    return response.data.secure_url;
                } else {
                    throw new Error('Upload failed: No secure URL received');
                }
            });

            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Upload error:', error.response?.data || error.message);
            throw error;
        }
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setLoading(true);

            // Process tech stack
            let finalTechStack = values.techStack;
            if (values.techStack.includes('Other') && values.customTechStack) {
                finalTechStack = finalTechStack
                    .filter(tech => tech !== 'Other')
                    .concat(values.customTechStack);
            }

            // Upload all images
            const imageUrls = values.images?.length > 0 
                ? await uploadToCloudinary(values.images)
                : [];

            // Upload all videos
            const videoUrls = values.videos?.length > 0
                ? await uploadToCloudinary(values.videos)
                : [];

            const projectData = {
                ...values,
                techStack: finalTechStack,
                images: imageUrls,
                videos: videoUrls
            };

            const response = await axios.post('http://localhost:5000/project/add', projectData);

            if (response.data) {
                alert('Project added successfully!');
                resetForm();
                setSelectedImages([]);
                setSelectedVideos([]);
            }
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to add project. Please try again.');
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
            setFieldValue('images', updatedImages);
        } else {
            const updatedVideos = [...selectedVideos, ...newFiles];
            setSelectedVideos(updatedVideos);
            setFieldValue('videos', updatedVideos);
        }
    };

    const projectTypes = [
        'Web Development',
        'Mobile App',
        'UI/UX Design',
        'Machine Learning',
        'Data Science',
        'Other'
    ];

    const techStacks = [
        { name: 'MERN' }, { name: 'Django' }, { name: 'Java' }, { name: 'Python' }, 
        { name: 'React' }, { name: 'Node.js' }, { name: 'Angular' }, { name: 'Vue.js' }, 
        { name: 'PHP' }, { name: 'Laravel' }, { name: 'Flutter' }, { name: 'React Native' }, 
        { name: '.NET' }, { name: 'Spring Boot' }, { name: 'MongoDB' }
    ];

    const renderFilePreview = (files, type) => {
        const MAX_PREVIEW = 3;
        const totalFiles = files.length;
        const filesToShow = Array.from(files).slice(0, MAX_PREVIEW);
        
        return (
            <div className="flex flex-wrap items-center gap-2 mt-2">
                {filesToShow.map((file, index) => (
                    <div 
                        key={index} 
                        className="relative group bg-black rounded-lg p-1 flex items-center"
                    >
                        {type === 'image' && (
                            <div className="relative w-16 h-16">
                                <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={file.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        )}
                        {type === 'video' && (
                            <div className="w-16 h-16">
                                <video 
                                    className="w-full h-full object-cover rounded-lg"
                                    src={URL.createObjectURL(file)}
                                />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                const newFiles = Array.from(type === 'image' ? selectedImages : selectedVideos)
                                    .filter((_, i) => i !== index);
                                if (type === 'image') {
                                    setSelectedImages(newFiles);
                                    setFieldValue('images', newFiles);
                                } else {
                                    setSelectedVideos(newFiles);
                                    setFieldValue('videos', newFiles);
                                }
                            }}
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

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto border-2 border-gray-600 bg-[#252525] rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#1b1b1b] py-6">
                    <h2 className="text-center text-3xl font-bold text-[#F1EFEC]">
                        Add New Project
                    </h2>
                </div>

                <Formik
                    initialValues={{
                        title: '',
                        description: '',
                        type: '',
                        area: '',
                        githubLink: '',
                        liveLink: '',
                        techStack: '',
                        
                        images: [],
                        videos: []
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, setFieldValue, values }) => (
                        <Form className="p-8 space-y-6 bg-[#252525]">
                            {/* Title */}
                            <div>
                                <label className="block text-gray-100 text-sm font-semibold mb-2">
                                    Project Title
                                </label>
                                <Field
                                    name="title"
                                    className="w-full text-gray-300 px-4 py-2 rounded-lg border bg-[#3e3e3e] focus:outline-none focus:border-[#A7D2CB]"
                                    placeholder="Enter project title"
                                />
                                {errors.title && touched.title && (
                                    <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-gray-100 text-sm font-semibold mb-2">
                                    Description
                                </label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    rows={6}
                                    className="w-full px-4 py-2 rounded-lg border bg-[#3e3e3e] 
                                             focus:outline-none text-gray-300 focus:border-[#A7D2CB] resize-none"
                                    placeholder="Enter project description"
                                />
                                {errors.description && touched.description && (
                                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                                )}
                            </div>

                            {/* Type Dropdown */}
                            <div>
                                <label className="block text-gray-100 text-sm font-semibold mb-2">
                                    Project Type
                                </label>
                                <Field
                                    as="select"
                                    name="type"
                                    className="w-full px-4 py-2 rounded-lg border text-gray-300 bg-[#3e3e3e] focus:outline-none focus:border-[#A7D2CB]"
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
                                <label className="block text-gray-100 text-sm font-semibold mb-2">
                                    Project Area
                                </label>
                                <Field
                                    name="area"
                                    className="w-full px-4 py-2 rounded-lg border text-gray-300 bg-[#3e3e3e] focus:outline-none focus:border-[#A7D2CB]"
                                    placeholder="e.g., Frontend, Backend, Full Stack"
                                />
                                {errors.area && touched.area && (
                                    <div className="text-red-500 text-sm mt-1">{errors.area}</div>
                                )}
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-100 text-sm font-semibold mb-2">
                                        GitHub Link
                                    </label>
                                    <Field
                                        name="githubLink"
                                        className="w-full px-4 py-2 rounded-lg border text-gray-300 bg-[#3e3e3e] focus:outline-none focus:border-[#A7D2CB]"
                                        placeholder="GitHub repository URL"
                                    />
                                    {errors.githubLink && touched.githubLink && (
                                        <div className="text-red-500 text-sm mt-1">{errors.githubLink}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-100 text-sm font-semibold mb-2">
                                        Live Link
                                    </label>
                                    <Field
                                        name="liveLink"
                                        className="w-full px-4 py-2 rounded-lg border text-gray-300 bg-[#3e3e3e] focus:outline-none focus:border-[#A7D2CB]"
                                        placeholder="Live project URL"
                                    />
                                    {errors.liveLink && touched.liveLink && (
                                        <div className="text-red-500 text-sm mt-1">{errors.liveLink}</div>
                                    )}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <label className="block text-gray-100 text-sm font-semibold mb-2">
                                    Tech Stack
                                </label>
                                <Field
                                    name="techStack"
                                    className="w-full px-4 py-2 rounded-lg border text-gray-300 bg-[#3e3e3e] focus:outline-none focus:border-[#A7D2CB]"
                                    placeholder="e.g., MERN, React, Node.js (comma-separated)"
                                />
                                <p className="text-[#E5E3D4]/50 text-xs mt-1">
                                    Add multiple tech stacks separated by commas
                                </p>
                                {errors.techStack && touched.techStack && (
                                    <div className="text-red-500 text-sm mt-1">{errors.techStack}</div>
                                )}
                            </div>

                            {/* File Uploads */}
                            <div className="space-y-4">
                                {/* Images Upload */}
                                <div>
                                    <label className="block text-gray-100 text-sm font-semibold mb-2">
                                        Project Images
                                    </label>
                                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
                                                  rounded-lg bg-[#4e4e4e] border-[#D4C9BE]">
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
                                    {selectedImages.length > 0 && renderFilePreview(selectedImages, 'image')}
                                </div>

                                {/* Videos Upload */}
                                <div>
                                    <label className="block text-gray-100 text-sm font-semibold mb-2">
                                        Project Videos
                                    </label>
                                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
                                                  rounded-lg bg-[#5b5b5b] border-[#D4C9BE]">
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
                                    {selectedVideos.length > 0 && renderFilePreview(selectedVideos, 'video')}
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
                                    {loading ? 'Adding Project...' : 'Add Project'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddProject;