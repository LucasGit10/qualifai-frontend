import { Box, Typography, useTheme } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { alpha } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const StyledColumn = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOver',
})(({ theme, isOver }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: 320,
  backgroundColor: isOver
    ? alpha(theme.palette.primary.main, 0.05)
    : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  minHeight: 200,
  border: '1px solid',
  borderColor: isOver
    ? theme.palette.primary.main
    : theme.palette.divider,
  boxShadow: theme.shadows[1],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

export default function ConversationColumn({
  id,
  name,
  items,
  children
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const theme = useTheme();

  return (
    <StyledColumn
      ref={setNodeRef}
      isOver={isOver}
    >
      <Typography variant="subtitle1" sx={{
        mb: 2,
        color: 'text.primary',
        fontWeight: 600,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      }}>
        {name} ({items.length})
      </Typography>
      <Box sx={{ minHeight: 100 }}>
        {children}
        {items.length === 0 && (
          <Box
            sx={{
              height: 60,
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Arraste conversas para cá
            </Typography>
          </Box>
        )}
      </Box>
    </StyledColumn>
  );
}