import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GlassCardContainer } from './style';

export default function SolutionCard({ item, onViewDetails }) {
  return (
    <GlassCardContainer>
      {item.verified && (
        <Chip 
          label="VERIFICADO" 
          size="small" 
          icon={<CheckCircleIcon style={{ fontSize: 12, color: '#34d399' }} />}
          sx={{ 
            position: 'absolute', top: 0, right: 0, 
            borderTopRightRadius: 24, borderBottomLeftRadius: 16, borderRadius: 0,
            bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', 
            fontWeight: 'bold', fontSize: '0.6rem', height: '28px', px: 0.5,
            backdropFilter: 'blur(4px)', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', borderLeft: '1px solid rgba(16, 185, 129, 0.2)'
          }} 
        />
      )}
      
      <Box display="flex" gap={2.5} mb={3}>
        <Box sx={{ 
          width: 68, height: 68, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: item.color, boxShadow: `0 10px 30px ${item.color}40`, fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
          border: '1px solid rgba(255,255,255,0.2)', position: 'relative', overflow: 'hidden'
        }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom right, rgba(255,255,255,0.4), transparent)', opacity: 0.3 }} />
          {item.logo}
        </Box>
        <Box pt={0.5}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', lineHeight: 1.2 }}>{item.name}</Typography>
          <Box display="flex" alignItems="center" gap={1} mt={0.8}>
            <Chip 
              label={item.category} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.08)', color: '#e2e8f0', height: 24, fontSize: '0.75rem', fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.1)' 
              }} 
            />
            <Box display="flex" alignItems="center" color="#fbbf24">
              <StarIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ ml: 0.5, color: '#e2e8f0', fontWeight: 600 }}>{item.rating}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, flexGrow: 1, lineHeight: 1.6 }}>
        {item.description}
      </Typography>

      <Box pt={3} borderTop="1px solid rgba(255,255,255,0.08)" mt="auto">
        <Box display="flex" gap={1} mb={3} flexWrap="wrap">
          {item.tags.map(tag => (
            <Typography key={tag} variant="caption" sx={{ 
              color: '#d8b4fe', bgcolor: 'rgba(168, 85, 247, 0.1)', px: 1.5, py: 0.5, borderRadius: 2,
              fontSize: '0.7rem', fontWeight: 600, border: '1px solid rgba(168, 85, 247, 0.2)'
            }}>
              #{tag}
            </Typography>
          ))}
        </Box>
        <Button 
          fullWidth 
          variant="contained" 
          endIcon={<ArrowForwardIcon />}
          onClick={() => onViewDetails(item)}
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.05)', 
            color: '#e879f9', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            py: 1.5,
            fontWeight: 700,
            textTransform: 'none',
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': { 
              bgcolor: '#c084fc', 
              color: '#fff',
              boxShadow: '0 0 25px rgba(192, 132, 252, 0.6)',
              borderColor: 'transparent',
              transform: 'translateY(-2px)'
            } 
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>Ver Detalhes</Box>
        </Button>
      </Box>
    </GlassCardContainer>
  );
}