import React from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseByCategory = () => {
  const navigate = useNavigate();

  const categories = [
    {
      type: 'Web Development',
      image: '/images/webdev.jpeg', 
      description: 'Full-stack, frontend, and backend web projects',
      color: 'rgba(0, 229, 255, 0.2)'
    },
    {
      type: 'Mobile App',
      image: '/images/mobile-app.jpg',
      description: 'iOS, Android, and cross-platform mobile applications',
      color: 'rgba(255, 0, 150, 0.2)'
    },
    {
      type: 'UI/UX Design',
      image: '/images/uiux.jpg',
      description: 'User interface and experience design projects',
      color: 'rgba(147, 51, 234, 0.2)'
    },
    {
      type: 'Machine Learning',
      image: '/images/ml.jpeg',
      description: 'AI and machine learning implementations',
      color: 'rgba(52, 211, 153, 0.2)'
    },
    {
      type: 'Data Science',
      image: '/images/data-science.png',
      description: 'Data analysis and visualization projects',
      color: 'rgba(251, 191, 36, 0.2)'
    },
    {
      type: 'Other',
      image: '/images/other.jpg',
      description: 'Miscellaneous technical projects',
      color: 'rgba(239, 68, 68, 0.2)'
    }
  ];

  const handleCategoryClick = (type) => {
    navigate(`/category/${encodeURIComponent(type)}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-[#1C325B]/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E5E3D4] text-center mb-4">
            Browse by Category
          </h1>
          <p className="text-[#E5E3D4]/70 text-center text-lg mb-12">
            Explore projects across different technology domains
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.type}
                className="bg-[#252525] rounded-xl border border-[#6A669D]/20 
                         overflow-hidden transition-all duration-300 
                         hover:scale-[1.02] hover:border-[#9ABF80]/30 
                         hover:shadow-lg hover:shadow-[#6A669D]/10"
                onClick={() => handleCategoryClick(category.type)}
              >
                <div className="aspect-video relative">
                  <img
                    src={category.image}
                    alt={category.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 hover:bg-black/30 
                                transition-colors duration-300"></div>
                </div>
                <div className="p-6">
                  <h2 className="text-[#E5E3D4] text-xl font-bold mb-2">
                    {category.type}
                  </h2>
                  <p className="text-[#E5E3D4]/70 mb-6">
                    {category.description}
                  </p>
                  <button
                    onClick={() => handleCategoryClick(category.type)}
                    className="w-full py-3 px-4 bg-[#6A669D]/20 
                             hover:bg-[#6A669D]/30 text-[#E5E3D4] 
                             rounded-lg transition-colors duration-300 
                             flex items-center justify-center"
                  >
                    View Projects
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseByCategory;