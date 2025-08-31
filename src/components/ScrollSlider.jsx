import { useState, useEffect, useRef } from 'react';

const ScrollSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const slidesRef = useRef([]);

  // Sample data with placeholder content
  const slides = [
    {
      id: 1,
      image: "https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=Slide+1",
      title: "Your First Project",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    },
    {
      id: 2,
      image: "https://via.placeholder.com/1200x800/7C3AED/FFFFFF?text=Slide+2",
      title: "Amazing Features",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse."
    },
    {
      id: 3,
      image: "https://via.placeholder.com/1200x800/EC4899/FFFFFF?text=Slide+3",
      title: "Beautiful Design",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui."
    },
    {
      id: 4,
      image: "https://via.placeholder.com/1200x800/10B981/FFFFFF?text=Slide+4",
      title: "Easy Integration",
      description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit."
    },
    {
      id: 5,
      image: "https://via.placeholder.com/1200x800/F59E0B/FFFFFF?text=Slide+5",
      title: "Perfect Performance",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis."
    },
    {
      id: 6,
      image: "https://via.placeholder.com/1200x800/EF4444/FFFFFF?text=Slide+6",
      title: "Get Started Today",
      description: "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit."
    }
  ];

  useEffect(() => {
    let startY = 0;
    let isScrolling = false;

    const handleWheel = (e) => {
      e.preventDefault();
      
      if (isScrolling) return;
      isScrolling = true;

      const delta = e.deltaY;
      if (delta > 0 && currentSlide < slides.length - 1) {
        // Scroll down - next slide
        setCurrentSlide(prev => prev + 1);
      } else if (delta < 0 && currentSlide > 0) {
        // Scroll up - previous slide
        setCurrentSlide(prev => prev - 1);
      }

      // Apply transforms immediately
      slidesRef.current.forEach((slide, index) => {
        if (slide) {
          const offset = index - currentSlide - (delta > 0 ? 1 : delta < 0 ? -1 : 0);
          slide.style.transform = `translateX(${offset * 100}%)`;
          slide.style.opacity = offset === 0 ? '1' : '0';
        }
      });

      setTimeout(() => {
        isScrolling = false;
      }, 800);
    };

    const handleTouch = (e) => {
      if (e.touches.length > 1) return;
      
      if (e.type === 'touchstart') {
        startY = e.touches[0].clientY;
      } else if (e.type === 'touchend' && !isScrolling) {
        const endY = e.changedTouches[0].clientY;
        const deltaY = startY - endY;
        
        if (Math.abs(deltaY) > 50) {
          isScrolling = true;
          
          if (deltaY > 0 && currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
          } else if (deltaY < 0 && currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
          }
          
          setTimeout(() => {
            isScrolling = false;
          }, 800);
        }
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
      containerRef.current.addEventListener('touchstart', handleTouch, { passive: true });
      containerRef.current.addEventListener('touchend', handleTouch, { passive: true });
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('wheel', handleWheel);
        containerRef.current.removeEventListener('touchstart', handleTouch);
        containerRef.current.removeEventListener('touchend', handleTouch);
      }
    };
  }, [currentSlide, slides.length]);

  // Apply transforms when currentSlide changes
  useEffect(() => {
    slidesRef.current.forEach((slide, index) => {
      if (slide) {
        const offset = index - currentSlide;
        slide.style.transform = `translateX(${offset * 100}%)`;
        slide.style.opacity = offset === 0 ? '1' : '0';
        slide.style.transition = 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out';
      }
    });
  }, [currentSlide]);

  return (
    <div className="w-full">
      {/* Intro Section */}
      <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="text-center text-white z-10 px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
            Demo Slider
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Scroll through our placeholder content showcase
          </p>
          <div className="animate-bounce">
            <svg className="w-8 h-8 mx-auto text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Slider Container - This creates the scroll space */}
      <div 
        ref={containerRef}
        className="relative h-screen overflow-hidden"
      >
        {/* Slider Viewport */}
        <div className="w-full h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              ref={el => slidesRef.current[index] = el}
              className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
              style={{
                transform: `translateX(${index === 0 ? 0 : 100}%)`,
                opacity: index === 0 ? 1 : 0
              }}
            >
              {/* Background Image with Parallax Effect */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{ 
                  backgroundImage: `url(${slide.image})`,
                  backgroundAttachment: 'fixed'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-6 lg:px-12">
                  <div className="max-w-4xl">
                    <div className="mb-4">
                      <span className="inline-block px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                        {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                      </span>
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h2>
                    
                    <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mb-8">
                      {slide.description}
                    </p>
                    
                    <button className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300">
                      Learn More
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Progress Indicators */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col space-y-3">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white bg-opacity-40 hover:bg-opacity-60'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Current Slide Info */}
        <div className="fixed bottom-8 left-8 z-20">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-6 py-4 text-white">
            <div className="text-sm opacity-80 mb-1">Current Slide</div>
            <div className="text-lg font-semibold">{slides[currentSlide]?.title}</div>
          </div>
        </div>
      </div>

      {/* Outro Section */}
      <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Demo Complete</h2>
          <p className="text-xl opacity-80 mb-8">Replace with your own content and images</p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
            Customize Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScrollSlider;
