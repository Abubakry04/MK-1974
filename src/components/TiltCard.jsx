import React, { useRef, useState, useCallback, useEffect } from 'react';

export default function TiltCard({ children, className = '', maxRotation = 15, perspective = 1000, scale = 1.05 }) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile scroll-based tilt
  useEffect(() => {
    const checkMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    setIsMobile(checkMobile);

    if (!checkMobile) return;

    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if element is in viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // Calculate center point relative to viewport (0 = top, 1 = bottom)
        const elementCenter = rect.top + rect.height / 2;
        const percentage = elementCenter / viewportHeight; 
        
        // Tilt X-axis based on scroll position (-maxRotation to maxRotation)
        const rotateX = (0.5 - percentage) * (maxRotation * 2);
        
        setRotation({ x: rotateX, y: 0 });
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [maxRotation]);

  // Desktop mouse-based tilt
  const handleMouseMove = useCallback(
    (e) => {
      if (isMobile || !cardRef.current) return;
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / (rect.height / 2)) * -maxRotation;
      const rotateY = (mouseX / (rect.width / 2)) * maxRotation;
      
      setRotation({ x: rotateX, y: rotateY });
    },
    [isMobile, maxRotation]
  );

  const handleMouseEnter = () => {
    if (!isMobile) setIsActive(true);
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsActive(false);
      setRotation({ x: 0, y: 0 });
    }
  };

  const currentScale = isMobile ? 1 : (isActive ? scale : 1);

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        transform: isActive
          ? `scale3d(${currentScale}, ${currentScale}, ${currentScale}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          : 'scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)',
      }}
    >
      <div style={{ 
        transform: isActive ? 'translateZ(30px)' : 'translateZ(0px)', 
        transition: 'transform 0.3s ease-out', 
        width: '100%', 
        height: '100%' 
      }}>
        {children}
      </div>
    </div>
  );
}
