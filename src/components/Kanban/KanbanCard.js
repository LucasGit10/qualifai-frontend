import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, Chip, Typography, IconButton, Box } from '@mui/material';
import { DragIndicator as DragIcon, Edit as EditIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { priorityConfig } from './kanbanConfig';
import Card from '../../components/ui/Card';

export default function KanbanCard({ item, onClick, onEdit }) {
  const itemId = item?.id || item?._id || 'default-id';

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: itemId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!item) return null;

  const normalizedItem = {
    ...item,
    id: itemId
  };

  return (
    <Card
      ref={setNodeRef}
      isDragging={isDragging}
      variant="default"
      style={style}
      onClick={() => onClick?.(normalizedItem)}
      {...attributes}
    >
      <div
        {...listeners}
        style={{
          cursor: 'grab',
          touchAction: 'none',
        }}
      >
        <DragIcon sx={{
          color: 'action.active',
          opacity: 0.6,
          mr: 1.5,
          '&:hover': { opacity: 1 },
        }} />
      </div>

      <Box sx={{ flex: 1, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            sx={{
              bgcolor: item?.color || '#ccc',
              width: 32,
              height: 32,
              mr: 2,
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            {item?.title?.charAt(0) || '?'}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
            {item?.title || 'Sem título'}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) {
                onEdit(normalizedItem);
              }
            }}
            sx={{ ml: 1 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          {item?.priority && (
            <Chip
              label={item.priority}
              size="small"
              sx={{
                ml: 1,
                backgroundColor: priorityConfig[item.priority]?.hex || '#ccc',
                color: 'white',
                fontSize: '0.7rem',
                height: '20px'
              }}
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{
          mb: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {item?.description || 'Sem descrição'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {item?.date && (
            <Chip
              label={item.date}
              size="small"
              sx={{
                backgroundColor: (theme) => alpha(theme.palette.common.black, 0.05),
                fontSize: '0.7rem'
              }}
            />
          )}
          {item?.tags?.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {item.tags.slice(0, 2).map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: theme => alpha(theme.palette.common.black, 0.05),
                    fontSize: '0.7rem'
                  }}
                />
              ))}
              {item.tags.length > 2 && (
                <Chip
                  label={`+${item.tags.length - 2}`}
                  size="small"
                  sx={{
                    backgroundColor: theme => alpha(theme.palette.common.black, 0.05),
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
}