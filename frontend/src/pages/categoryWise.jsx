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
                className="bg-[#252525] p-6 rounded-xl border border-[#6A669D]/20 h-full"
              >
                <div className="flex flex-col h-full">
                  {project.images?.[0] && (
                    <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h2 className="text-[#E5E3D4] text-xl font-bold mb-2">{project.title}</h2>
                  <p className="text-[#E5E3D4]/70 mb-4 line-clamp-2 flex-grow">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-col space-y-3 mt-auto">
                    <button
                      onClick={() => handleViewProject(project._id)}
                      className="w-full py-3 px-4 bg-[#E5E3D4] hover:bg-[#383563]/90 
                                text-black font-semibold rounded-lg transition-all duration-300 
                                flex items-center justify-center space-x-2 group"
                    >
                      <FiEye className="w-5 h-5" />
                      <span>View Details</span>
                    </button>
                    
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#6A669D]/20 text-[#9ABF80] text-sm">
                        {project.type}
                      </span>
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-[#6A669D]/20 hover:bg-[#6A669D]/30 
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