import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ManageProjects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/project/getall');
            setProjects(response.data);
        } catch (error) {
            toast.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`http://localhost:5000/project/delete/${id}`);
                setProjects(projects.filter(project => project._id !== id));
                toast.success('Project deleted successfully');
            } catch (error) {
                toast.error('Failed to delete project');
            }
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ProjectCard = ({ project }) => {
        const navigate = useNavigate();

        return (
            <div className="bg-[#252525] rounded-lg overflow-hidden border border-[#6A669D]/20 
                          hover:border-[#9ABF80]/30 hover:shadow-sm hover:shadow-[#6A669D]/10 
                          transition-all duration-300 max-w-sm">
                <div className="relative h-32"> {/* Reduced height from aspect-video */}
                    {project.images?.[0] ? (
                        <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#1C325B] flex items-center justify-center">
                            <span className="text-[#6A669D]/50 text-sm">No Image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                <div className="p-3"> {/* Reduced padding from p-4 */}
                    <div className="flex items-start justify-between mb-1"> {/* Reduced margin */}
                        <h3 className="text-base font-medium text-[#E5E3D4] line-clamp-1 flex-1">
                            {project.title}
                        </h3>
                    </div>

                    <p className="text-[#E5E3D4]/60 text-xs line-clamp-1 mb-2"> {/* Reduced text size and lines */}
                        {project.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-[#1C325B] text-[#9ABF80] text-xs">
                            {project.type}
                        </span>

                        <div className="flex space-x-1"> {/* Reduced spacing */}
                            <button
                                onClick={() => navigate(`/view-project/${project._id}`)}
                                className="p-1.5 rounded-md bg-[#1C325B] hover:bg-[#1C325B]/80 
                                         text-[#E5E3D4] transition-colors"
                                title="View project"
                            >
                                <FiEye className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => navigate(`/update-project/${project._id}`)}
                                className="p-1.5 rounded-md bg-[#9ABF80]/20 hover:bg-[#9ABF80]/30 
                                         text-[#9ABF80] transition-colors"
                                title="Edit project"
                            >
                                <FiEdit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(project._id)}
                                className="p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 
                                         text-red-400 transition-colors"
                                title="Delete project"
                            >
                                <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1C325B] flex items-center justify-center">
                <div className="text-[#E5E3D4]/80">Loading projects...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header Section */}
            <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-[#1C325B]/10 border-b border-[#6A669D]/20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <h1 className="text-4xl font-bold text-[#E5E3D4]">
                            Manage Projects
                        </h1>
                        
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-80">
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 rounded-lg bg-[#252525] 
                                             border border-[#6A669D]/20 text-[#E5E3D4] 
                                             placeholder-[#E5E3D4]/50 focus:outline-none 
                                             focus:border-[#9ABF80]/50 transition-colors"
                                />
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                                   text-[#E5E3D4]/50 w-4 h-4" />
                            </div>
                            
                            <button
                                onClick={() => navigate('/add-project')}
                                className="px-4 py-2 bg-[#9ABF80] hover:bg-[#9ABF80]/90 
                                         text-black font-medium rounded-lg transition-colors"
                            >
                                Add Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-[#E5E3D4]/70 text-center py-12">Loading projects...</div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-[#E5E3D4]/70 text-center py-12">
                        {searchTerm ? 'No matching projects found.' : 'No projects yet.'}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProjects.map(project => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProjects;