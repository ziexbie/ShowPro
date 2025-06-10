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
  const [selectedTechStacks, setSelectedTechStacks] = useState([]); // New state for selected tech stacks

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

  const handleTechStackToggle = (tech) => {
    setSelectedTechStacks(prev => 
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedTechStacks([]);
    setSearchTerm('');
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(project.type);
    const matchesTechStack = selectedTechStacks.length === 0 || 
                            project.techStack?.split(',').some(tech => 
                              selectedTechStacks.includes(tech.trim())
                            );
    return matchesSearch && matchesType && matchesTechStack;
  });

  const handleViewProject = (projectId) => {
    navigate(`/view-project/${projectId}`);
  };

  const handleCategorySelect = (type) => {
    navigate(`/category/${encodeURIComponent(type)}`);
  };

  useEffect(() => {
    console.log('Projects:', projects);
  }, [projects]);

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

              {/* Project Types and Tech Stack Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => handleTypeToggle(type)}
                      className={`px-4 py-2 rounded-full transition-all duration-300 
                                ${selectedTypes.includes(type)
                                  ? 'bg-[#181818] text-black font-medium'
                                  : 'bg-[#6A669D]/20 text-[#E5E3D4] hover:bg-[#6A669D]/30'
                                }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Tech Stacks - Replaced dropdown with buttons */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTechStacks}
                    onChange={(e) => setSelectedTechStacks(e.target.value ? [e.target.value] : [])}
                    className="px-4 py-2 rounded-lg bg-[#6A669D]/10 
                              border border-[#6A669D]/30 text-[#999945] 
                              focus:outline-none focus:border-[#9ABF80]/50 
                              transition-colors cursor-pointer"
                  >
                    <option value="" className='bg-[#252525] text-[#E5E3D4]'>All Tech Stacks</option>
                    {techStacks.map(tech => (
                      <option key={tech.name} value={tech.name}>
                        {tech.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button */}
                {(selectedTypes.length > 0 || selectedTechStacks.length > 0) && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProjects.map((project, index) => (
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
      </div>
    </div>
  );
};

export default Browse;
