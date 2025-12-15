import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTopButton = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={isVisible}>
      <Fab
        onClick={scrollToTop}
        size="medium"
        aria-label="scroll back to top"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #6366f1, #db2777)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(4px)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(99, 102, 241, 0.6)',
            background: 'linear-gradient(135deg, #4f46e5, #be185d)',
          }
        }}
      >
        <KeyboardArrowUpIcon fontSize="medium" />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTopButton;