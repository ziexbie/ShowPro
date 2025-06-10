import React, { useState, useEffect, useRef } from 'react';
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
  const [availableTechStacks, setAvailableTechStacks] = useState([]); // New state for available tech stacks
  const [availableProjectTypes, setAvailableProjectTypes] = useState([
    'Web Development',
    'Mobile App',
    'UI/UX Design',
    'Machine Learning',
    'Data Science',
    'Other'
  ]); // Replace static projectTypes with state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [techStackSearch, setTechStackSearch] = useState('');
  const dropdownRef = useRef(null);

  const techStacks = [
    { name: 'MERN', color: '#47A248' },
    { name: 'Django', color: '#47A248' },
    { name: 'Java', color: '#47A248' },
    { name: 'Python', color: '#47A248' },
    { name: 'React', color: '#47A248' },
    { name: 'Node.js', color: '#47A248' },
    { name: 'Angular', color: '#47A248' },
    { name: 'Vue.js', color: '#47A248' },
    { name: 'PHP', color: '#47A248' },
    { name: 'Laravel', color: '#47A248' },
    { name: 'Flutter', color: '#47A248' },
    { name: 'React Native', color: '#47A248' },
    { name: '.NET', color: '#47A248' },
    { name: 'Spring Boot', color: '#47A248' },
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

  // Add this helper function at the top of your component
  const extractUniqueTechStacks = (projects) => {
    const uniqueTechs = new Set();
    
    // Add predefined tech stacks
    techStacks.forEach(tech => uniqueTechs.add(tech.name));
    
    // Add tech stacks from projects
    projects.forEach(project => {
      if (project.techStack) {
        const techs = project.techStack.split(',').map(tech => tech.trim());
        techs.forEach(tech => uniqueTechs.add(tech));
      }
    });
    
    return Array.from(uniqueTechs).sort();
  };

  // Add helper function to extract unique project types
  const extractUniqueProjectTypes = (projects) => {
    const uniqueTypes = new Set();
    
    // Add predefined types
    availableProjectTypes.forEach(type => uniqueTypes.add(type));
    
    // Add types from projects
    projects.forEach(project => {
      if (project.type) {
        uniqueTypes.add(project.type.trim());
      }
    });
    
    return Array.from(uniqueTypes).sort();
  };

  // Update your useEffect to set available tech stacks when projects are fetched
  useEffect(() => {
    if (projects.length > 0) {
      const uniqueTechs = extractUniqueTechStacks(projects);
      const uniqueTypes = extractUniqueProjectTypes(projects);
      setAvailableTechStacks(uniqueTechs);
      setAvailableProjectTypes(uniqueTypes);
    }
  }, [projects]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                  {/* Replace the existing projectTypes.map with this */}
                  {availableProjectTypes.map(type => (
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
                </div>

                {/* Tech Stacks Custom Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="px-4 py-2 rounded-lg bg-[#252525] border border-[#6A669D]/30 
                               text-[#E5E3D4] hover:border-[#9ABF80]/50 transition-colors 
                               flex items-center justify-between gap-2 min-w-[200px]"
                  >
                    <span className="truncate">
                      {selectedTechStacks.length > 0 
                        ? `${selectedTechStacks.length} selected` 
                        : 'Select Tech Stacks'}
                    </span>
                    <FiChevronDown className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-[#252525] border border-[#6A669D]/30 
                                    rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2 border-b border-[#6A669D]/30">
                        <input
                          type="text"
                          value={techStackSearch}
                          onChange={(e) => setTechStackSearch(e.target.value)}
                          placeholder="Search tech stacks..."
                          className="w-full px-3 py-1.5 rounded bg-[#1a1a1a] border border-[#6A669D]/30 
                                     text-[#E5E3D4] placeholder-[#E5E3D4]/50 focus:outline-none 
                                     focus:border-[#9ABF80]/50"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {availableTechStacks
                          .filter(tech => tech.toLowerCase().includes(techStackSearch.toLowerCase()))
                          .map(tech => {
                            const techInfo = techStacks.find(t => t.name === tech);
                            const isSelected = selectedTechStacks.includes(tech);
                            
                            return (
                              <button
                                key={tech}
                                onClick={() => {
                                  setSelectedTechStacks(prev => 
                                    isSelected 
                                      ? prev.filter(t => t !== tech)
                                      : [...prev, tech]
                                  );
                                }}
                                className={`w-full px-4 py-2 text-left hover:bg-[#6A669D]/20 
                                           flex items-center gap-2 transition-colors
                                           ${isSelected ? 'bg-[#9ABF80]/10' : ''}`}
                              >
                                <div className={`w-4 h-4 rounded border ${
                                  isSelected 
                                    ? 'bg-[#9ABF80] border-[#9ABF80]' 
                                    : 'border-[#6A669D]/50'
                                } flex items-center justify-center`}>
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span style={{ color: techInfo ? techInfo.color : '#E5E3D4' }}>
                                  {tech}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
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

              {/* Selected Tech Stacks Tags */}
              {selectedTechStacks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTechStacks.map(tech => {
                    const techInfo = techStacks.find(t => t.name === tech);
                    return (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{
                          backgroundColor: techInfo ? `${techInfo.color}15` : '#6A669D20',
                          color: techInfo ? techInfo.color : '#9ABF80'
                        }}
                      >
                        {tech}
                        <button
                          onClick={() => setSelectedTechStacks(prev => prev.filter(t => t !== tech))}
                          className="hover:text-red-400"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
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
