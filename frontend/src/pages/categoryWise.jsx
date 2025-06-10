import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiLink, FiEye, FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import SpotlightCard from '../components/SpotlightCard';

const CategoryWise = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category ? decodeURIComponent(category) : '');

  const projectTypes = [
    'Web Development',
    'Mobile App',
    'UI/UX Design',
    'Machine Learning',
    'Data Science',
    'Other'
  ];

  const techStacks = [
    { name: 'MERN', color: '#61DAFB' },
    { name: 'Django', color: '#092E20' },
    { name: 'Java', color: '#F89820' },
    { name: 'Python', color: '#FFD43B' },
    { name: 'React', color: '#61DAFB' },
    { name: 'Node.js', color: '#339933' },
    { name: 'Angular', color: '#DD0031' },
    { name: 'Vue.js', color: '#4FC08D' },
    { name: 'PHP', color: '#777BB4' },
    { name: 'Laravel', color: '#FF2D20' },
    { name: 'Flutter', color: '#02569B' },
    { name: 'React Native', color: '#61DAFB' },
    { name: '.NET', color: '#512BD4' },
    { name: 'Spring Boot', color: '#6DB33F' },
    { name: 'MongoDB', color: '#47A248' },
  ];

  const spotlightColors = [
    'rgba(0, 229, 255, 0.2)',
    'rgba(255, 0, 150, 0.2)',
    'rgba(147, 51, 234, 0.2)',
    'rgba(52, 211, 153, 0.2)',
    'rgba(251, 191, 36, 0.2)'
  ];

  useEffect(() => {
    if (category) {
      setSelectedCategory(decodeURIComponent(category));
    }
    fetchProjects();
  }, [category]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/project/getall');
      const filteredProjects = category 
        ? response.data.filter(project => project.type === decodeURIComponent(category))
        : response.data;
      setProjects(filteredProjects);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleCategoryChange = (type) => {
    navigate(`/category/${encodeURIComponent(type)}`);
  };

  const handleViewProject = (projectId) => {
    navigate(`/view-project/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8  bg-[#6A669D]/10 border-b-2 border-gray-600">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/browse-projects')}
              className="p-2 rounded-full bg-[#6A669D]/20 hover:bg-[#6A669D]/30 
                       text-[#E5E3D4] transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl font-bold text-[#E5E3D4]">
              Browse by Category
            </h1>
          </div>

          {/* Category Selector */}
          <div className="relative group inline-block">
            <button className="px-6 py-3 rounded-lg bg-[#6A669D]/20 
                             text-[#E5E3D4] hover:bg-[#6A669D]/30 
                             transition-colors flex items-center gap-2">
              {selectedCategory || 'Select Category'}
              <FiChevronDown className="w-5 h-5 transition-transform 
                                      group-hover:transform group-hover:rotate-180" />
            </button>
            <div className="absolute left-0 mt-2 w-56 rounded-lg bg-[#1C325B] 
                          border border-[#6A669D]/20 shadow-xl opacity-0 
                          invisible group-hover:opacity-100 group-hover:visible 
                          transition-all duration-300 z-50">
              {projectTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleCategoryChange(type)}
                  className={`w-full px-4 py-2 text-left transition-colors
                            ${type === selectedCategory 
                              ? 'bg-[#9ABF80]/20 text-[#9ABF80]' 
                              : 'text-[#E5E3D4] hover:bg-[#6A669D]/20'} 
                            first:rounded-t-lg last:rounded-b-lg`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-[#E5E3D4] text-xl text-center">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-[#E5E3D4] text-xl text-center">
            No projects found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <SpotlightCard
                key={project._id}
                spotlightColor={spotlightColors[index % spotlightColors.length]}
                className="bg-[#252525] p-4 rounded-xl border border-[#6A669D]/20 h-full 
                          transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  {/* Image with overlay gradient */}
                  {project.images?.[0] && (
                    <div className="relative aspect-video mb-4 rounded-lg overflow-hidden group">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 
                                 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    {/* Title and Description */}
                    <h2 className="text-[#E5E3D4] text-lg font-bold mb-2 line-clamp-1">
                      {project.title}
                    </h2>
                    <p className="text-[#E5E3D4]/70 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tags Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-2 py-1 rounded-full bg-[#6A669D]/20 
                                     text-[#9ABF80] text-xs font-medium">
                        {project.type}
                      </span>
                      {project.techStack && project.techStack.split(',').map((tech, idx) => {
                        const techInfo = techStacks.find(t => t.name === tech.trim());
                        return (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: techInfo ? `${techInfo.color}15` : '#6A669D20',
                              color: techInfo ? techInfo.color : '#9ABF80'
                            }}
                          >
                            {tech.trim()}
                          </span>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleViewProject(project._id)}
                        className="flex-1 py-2 px-3 bg-[#E5E3D4] hover:bg-[#9ABF80] 
                                 text-black text-sm font-medium rounded-lg transition-all 
                                 duration-300 flex items-center justify-center gap-1"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-[#6A669D]/20 hover:bg-[#6A669D]/30 
                                   text-[#E5E3D4]/70 hover:text-[#9ABF80] transition-colors"
                        >
                          <FiLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryWise;