import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IconButton, Typography, Box } from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import KanbanCard from './KanbanCard';
import { ColumnContainer, ColumnHeader, EmptyColumn } from './styles';
import { styled, alpha } from '@mui/material/styles';

const CardList = styled(Box)(({ theme, isOver }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: '8px',
  borderRadius: '12px',
  minHeight: '120px',
  transition: 'background-color 0.3s ease',
  backgroundColor: isOver ? alpha(theme.palette.primary.main, 0.03) : 'transparent',
}));

export const KanbanColumn = ({
  id,
  title,
  items,
  onClickCard,
  onRemoveColumn,
  onEditColumn,
  onEditCard
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const columnStyle = isOver ? {
    backgroundColor: theme => alpha(theme.palette.primary.main, 0.05),
    borderColor: theme => theme.palette.primary.main
  } : {};

  return (
    <ColumnContainer sx={columnStyle}>
      <ColumnHeader>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          {title}
          <Typography component="span" color="text.secondary" sx={{ marginLeft: '8px' }}>
            ({items.length})
          </Typography>
        </Typography>

        <div>
          <IconButton
            onClick={() => onEditColumn(id)}
            size="small"
            sx={{ color: 'text.secondary', marginRight: '4px' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => onRemoveColumn(id)}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </ColumnHeader>

      <CardList ref={setNodeRef} isOver={isOver}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map(item => (
            <KanbanCard
              key={item.id || item._id}
              item={item}
              onClick={onClickCard}
              onEdit={onEditCard}
            />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <EmptyColumn>
            <Typography variant="body2" color="text.secondary">
              Arraste cartões aqui
            </Typography>
          </EmptyColumn>
        )}
      </CardList>
    </ColumnContainer>
  );
};