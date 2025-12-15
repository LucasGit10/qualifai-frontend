import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

export const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const AnimatedCard = styled(motion.div)({
  height: '100%'
});

export const smoothScroll = (element) => {
  element.scrollIntoView({ 
    behavior: 'smooth',
    block: 'center'
  });
};