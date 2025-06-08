import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FiGithub, FiLink, FiChevronLeft, FiChevronRight, FiSave } from 'react-icons/fi';
import MDEditor from '@uiw/react-md-editor';

const ViewProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/project/get/${id}`);
      setProject(response.data);
      setEditedDescription(response.data.description);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      setLoading(false);
    }
  };

  const handleSaveDescription = async () => {
    try {
      const response = await axios.patch(`http://localhost:5000/project/update/${id}`, {
        description: editedDescription
      });
      
      if (response.data.project) {
        setProject(response.data.project);
        setIsEditing(false);
        // Optional: Add success feedback
        alert('Description updated successfully!');
      }
    } catch (error) {
      console.error('Error updating description:', error);
      // Add error feedback
      alert(error.response?.data?.message || 'Failed to update description');
    }
  };

  const handlePrevious = () => {
    if (mediaType === 'image') {
      setCurrentMediaIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    } else {
      setCurrentMediaIndex((prev) => 
        prev === 0 ? project.videos.length - 1 : prev - 1
      );
    }
  };

  const handleNext = () => {
    if (mediaType === 'image') {
      setCurrentMediaIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentMediaIndex((prev) => 
        prev === project.videos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const switchMediaType = (type) => {
    setMediaType(type);
    setCurrentMediaIndex(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#E5E3D4] text-xl">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#E5E3D4] text-xl">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Project Header */}
        <h1 className="text-6xl mt-5 mb-10 text-center font-bold text-[#E5E3D4] ">{project.title}</h1>
        <div className="bg-[#6A669D]/10 border-2 border-gray-600 rounded-xl p-8 mb-8">
          
          <div className="flex items-center gap-4 mb-4">
            <span className="px-4 py-1 rounded-full bg-[#6A669D]/20 text-[#9ABF80]">
              {project.type}
            </span>
            {project.area && (
              <span className="px-4 py-1 rounded-full bg-[#6A669D]/20 text-[#E5E3D4]/70">
                {project.area}
              </span>
            )}
          </div>
          
          {/* Description Section */}
          <div className="bg-[#6A669D]/10 rounded-xl p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#E5E3D4]">Description</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isEditing 
                      ? 'bg-[#9ABF80] text-black'
                      : 'bg-[#6A669D]/20 text-[#E5E3D4] hover:bg-[#6A669D]/30'
                  }`}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                {isEditing && (
                  <button
                    onClick={handleSaveDescription}
                    className="px-4 py-2 rounded-lg bg-[#9ABF80] text-black 
                             hover:bg-[#9ABF80]/90 transition-colors flex items-center gap-2"
                  >
                    <FiSave className="w-4 h-4" />
                    Save
                  </button>
                )}
              </div>
            </div>

            <div data-color-mode="dark">
              {isEditing ? (
                <MDEditor
                  value={editedDescription}
                  onChange={setEditedDescription}
                  preview="edit"
                  height={400}
                  className="bg-[#252525] border-[#6A669D]/30"
                />
              ) : (
                <MDEditor.Markdown
                  source={project.description}
                  className="!bg-transparent wmde-markdown"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#E5E3D4',
                    fontSize: '1.1rem',
                    lineHeight: '1.75',
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#6A669D]/20 
                         hover:bg-[#6A669D]/30 text-[#E5E3D4] rounded-lg transition-colors"
              >
                <FiGithub className="w-5 h-5" />
                <span>View Code</span>
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#9ABF80]/20 
                         hover:bg-[#9ABF80]/30 text-[#9ABF80] rounded-lg transition-colors"
              >
                <FiLink className="w-5 h-5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        {/* Media Carousel */}
        <div className="bg-[#6A669D]/10 border-2 border-gray-600 rounded-xl p-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => switchMediaType('image')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mediaType === 'image'
                  ? 'bg-[#9ABF80] text-black'
                  : 'bg-[#6A669D]/20 text-[#E5E3D4]'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => switchMediaType('video')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mediaType === 'video'
                  ? 'bg-[#9ABF80] text-black'
                  : 'bg-[#6A669D]/20 text-[#E5E3D4]'
              }`}
            >
              Videos
            </button>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              {mediaType === 'image' && project.images?.length > 0 ? (
                <img
                  src={project.images[currentMediaIndex]}
                  alt={`Project ${currentMediaIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : mediaType === 'video' && project.videos?.length > 0 ? (
                <video
                  src={project.videos[currentMediaIndex]}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#E5E3D4]/50">
                  No {mediaType}s available
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {((mediaType === 'image' && project.images?.length > 1) ||
              (mediaType === 'video' && project.videos?.length > 1)) && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                           bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                           bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Media Counter */}
          <div className="mt-4 text-center text-[#E5E3D4]/70">
            {mediaType === 'image' && project.images?.length > 0 && (
              `Image ${currentMediaIndex + 1} of ${project.images.length}`
            )}
            {mediaType === 'video' && project.videos?.length > 0 && (
              `Video ${currentMediaIndex + 1} of ${project.videos.length}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;