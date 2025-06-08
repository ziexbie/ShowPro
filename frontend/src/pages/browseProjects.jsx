import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiLink, FiEye, FiX, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SpotlightCard from '../components/SpotlightCard';

const Browse = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]); // Changed to array

  const projectTypes = [
    'Web Development',
    'Mobile App',
    'UI/UX Design',
    'Machine Learning',
    'Data Science',
    'Other'
  ];

  // Random spotlight colors for cards
  const spotlightColors = [
    'rgba(0, 229, 255, 0.2)',
    'rgba(255, 0, 150, 0.2)',
    'rgba(147, 51, 234, 0.2)',
    'rgba(52, 211, 153, 0.2)',
    'rgba(251, 191, 36, 0.2)'
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/project/getall');
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSearchTerm('');
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(project.type);
    return matchesSearch && matchesType;
  });

  const handleViewProject = (projectId) => {
    navigate(`/view-project/${projectId}`);
  };

  const handleCategorySelect = (type) => {
    navigate(`/category/${encodeURIComponent(type)}`);
  };

  return (
    <div className='browseContainer'>
      <div className="min-h-screen bg-black flex flex-col items-center">
        {/* Header Section - Fixed height */}
        <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto space-y-6 flex flex-col items-center ">
            <div className="flex justify-between items-center text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E5E3D4]">
                Browse Projects
              </h1>
              
              
            </div>
            
            <div className="flex flex-col items-center gap-4">
              {/* Search Bar */}
              <div className="relative w-[80%]">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-[#6A669D]/10 
                           border border-[#6A669D]/30 text-[#E5E3D4] 
                           placeholder-[#E5E3D4]/50 focus:outline-none 
                           focus:border-[#9ABF80]/50 transition-colors"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                 text-[#E5E3D4]/50 w-4 h-4" />
              </div>
              {/* Category Dropdown */}
              {/* <div className="relative group">
                <button className="px-4 py-2 rounded-lg bg-[#6A669D]/20 
                                 text-[#E5E3D4] hover:bg-[#6A669D]/30 
                                 transition-colors flex items-center gap-2">
                  Browse by Category
                  <FiChevronDown className="w-4 h-4 transition-transform 
                                          group-hover:transform group-hover:rotate-180" />
                </button>
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#1C325B] 
                              border border-[#6A669D]/20 shadow-xl opacity-0 
                              invisible group-hover:opacity-100 group-hover:visible 
                              transition-all duration-300 z-50">
                  {projectTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => handleCategorySelect(type)}
                      className="w-full px-4 py-2 text-left text-[#E5E3D4] 
                               hover:bg-[#6A669D]/20 first:rounded-t-lg 
                               last:rounded-b-lg transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {projectTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 
                              ${selectedTypes.includes(type)
                                ? 'bg-[#9ABF80] text-black font-medium'
                                : 'bg-[#6A669D]/20 text-[#E5E3D4] hover:bg-[#6A669D]/30'
                              }`}
                  >
                    {type}
                  </button>
                ))}
                {(selectedTypes.length > 0 || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 
                             hover:bg-red-500/30 transition-all duration-300 
                             flex items-center gap-2"
                  >
                    <FiX className="w-4 h-4" />
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Active Filters Display */}
              {selectedTypes.length > 0 && (
                <div className="flex items-center gap-2 text-[#E5E3D4]/70 text-sm">
                  <span>Active Filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTypes.map(type => (
                      <span
                        key={type}
                        className="px-2 py-1 rounded-full bg-[#9ABF80]/20 text-[#9ABF80]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects Grid Section - Flex grow and scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-2 sm:px-6 lg:px-8 min-h-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-[#E5E3D4] text-xl">Loading projects...</div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-[#E5E3D4] text-xl">
                  No projects found.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
                {filteredProjects.map((project, index) => (
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
      </div>
    </div>
  );
};

export default Browse;
