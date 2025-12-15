import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { useShowcaseContext } from '../../contexts/ShowcaseContext';

const ShowcaseBlocker = ({ children, featureKey, inline = false }) => {
  const { plan, canAccess, openModal } = useShowcaseContext();

  if (canAccess(featureKey)) {
    return children;
  }

  const tooltipTitle = plan === 'guest'
    ? "Funcionalidade para assinantes"
    : "Faça upgrade do seu plano para acessar";

  return (
    <Tooltip title={tooltipTitle}>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          openModal();
        }}
        sx={{
          position: 'relative',
          cursor: 'not-allowed',
          display: inline ? 'inline-block' : 'block',
          width: 'fit-content',
          '& > *': {
            opacity: 0.5,
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            opacity: 0.5,
            pointerEvents: 'none', 
          }}
        >
          {children}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lock
            sx={{
              color: 'text.primary',
              backgroundColor: 'rgba(120, 120, 120, 0.7)',
              borderRadius: '50%',
              p: 0.5,
            }}
          />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default ShowcaseBlocker;