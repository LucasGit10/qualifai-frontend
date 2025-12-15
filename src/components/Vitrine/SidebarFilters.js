import React from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarIcon from '@mui/icons-material/Star';
import { GlassPanel, FilterItemContainer } from './style';

export default function SidebarFilters({ selectedModels, onToggleModel, onClear }) {
  return (
    <GlassPanel sx={{ p: 3, position: 'sticky', top: '110px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="subtitle1" fontWeight="bold" color="white" display="flex" alignItems="center" gap={1}>
          <FilterListIcon sx={{ color: '#c084fc' }} /> Refinar
        </Typography>
        <Button size="small" sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }} onClick={onClear}>
          Limpar
        </Button>
      </Box>

      <Box mb={4}>
        <Typography variant="caption" color="rgba(255,255,255,0.5)" fontWeight="bold" mb={1.5} display="block" letterSpacing="1px">
          MODELO
        </Typography>
        <Box display="flex" flexDirection="column">
          {['SaaS', 'Serviço', 'Consultoria'].map((label) => (
            <FilterItemContainer 
              key={label} 
              active={selectedModels.includes(label) ? 1 : 0}
              onClick={() => onToggleModel(label)}
            >
              <Checkbox 
                checked={selectedModels.includes(label)} 
                size="small" 
                sx={{ p: 0, mr: 1.5, color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#c084fc' } }} 
              />
              <Typography variant="body2" color={selectedModels.includes(label) ? "white" : "rgba(255,255,255,0.7)"} fontWeight={selectedModels.includes(label) ? 600 : 400}>
                {label}
              </Typography>
            </FilterItemContainer>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="caption" color="rgba(255,255,255,0.5)" fontWeight="bold" mb={1.5} display="block" letterSpacing="1px">
          QUALIDADE
        </Typography>
        <Box sx={{ 
          p: 2, borderRadius: '16px', bgcolor: 'rgba(0,0,0,0.2)', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
          transition: '0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
        }}>
          <Box display="flex" color="#fbbf24">
            {[1,2,3,4,5].map(i => <StarIcon key={i} style={{ fontSize: 18 }} />)}
          </Box>
          <Typography variant="caption" color="white" fontWeight="bold">4.5+</Typography>
          <Checkbox size="small" sx={{ color: '#c084fc', '&.Mui-checked': { color: '#c084fc' }, p: 0 }} />
        </Box>
      </Box>
    </GlassPanel>
  );
}