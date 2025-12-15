import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Paper,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Chip,
  Tooltip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
  alpha,
  styled,
} from '@mui/material';
import {
  VoiceOverOff as VoiceOverOffIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import DescriptionIcon from '@mui/icons-material/Description';


const StyledPaper = styled(Paper)(({ theme, editmode, issortable }) => ({
  marginBottom: theme.spacing(1.5),
  userSelect: 'none',
  cursor: editmode === 'true' && issortable === 'true' ? 'grab' : 'pointer',
  width: '100%',
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  border: '1px solid',
  borderColor: theme.palette.divider,
  transition: 'all 0.25s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
  },
}));

export default function ConversationCard({
  conversation,
  onClick,
  lastMessage,
  editMode = false,
  isSortable = false,
  getChannelIcon,
  getStatusLabel,
  getStatusColor,
  hasNote,
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const sortable = useSortable({
    id: conversation._id,
    disabled: !isSortable || !editMode,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    if (editMode && isSortable) return;
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleOpenChat = () => {
    onClick(conversation._id);
    handleCloseMenu();
  };

  return (
    <StyledPaper
      ref={isSortable ? setNodeRef : undefined}
      {...(isSortable ? attributes : {})}
      {...(isSortable && editMode ? listeners : {})}
      editmode={editMode.toString()}
      issortable={isSortable.toString()}
      style={isSortable ? dragStyle : undefined}
      onClick={!editMode ? () => onClick(conversation._id) : undefined}
    >
      <ListItem
        sx={{
          py: 2,
          pr: 1,
        }}
        secondaryAction={
          !editMode && (
            <IconButton
              edge="end"
              onClick={handleMenuClick}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'secondary.main',
                  backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          )
        }
      >
        <ListItemAvatar>
          <Tooltip title={conversation.channel}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              {getChannelIcon(conversation.channel)}
            </Avatar>
          </Tooltip>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                {conversation.lead?.name || 'Sem nome'}
              </Typography>

              {conversation.aiEnabled === false && (
                <Tooltip title="IA desativada para esta conversa">
                  <Chip
                    icon={<VoiceOverOffIcon fontSize="small" />}
                    label="IA Inativa"
                    color="warning"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 22 }}
                  />
                </Tooltip>
              )}

              {hasNote(conversation) && (
                <Chip
                  icon={<DescriptionIcon fontSize="small" />}
                  label="Nota"
                  color="primary"
                  size="small"
                  sx={{ fontSize: '0.7rem', height: 22 }}
                />
              )}
            </Box>
          }
          secondary={
            <Box mt={0.5}>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
              >
                {conversation.lead?.company} • {conversation.lead?.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.7rem', mt: 0.3 }}
              >
                {conversation.messages?.length || 0} mensagens • Atualizado em:{' '}
                {format(new Date(conversation.updatedAt), 'dd/MM/yyyy HH:mm', {
                  locale: ptBR,
                })}
              </Typography>
              <Chip
                label={getStatusLabel(conversation.status)}
                color={getStatusColor(conversation.status)}
                size="small"
                sx={{
                  mt: 1,
                  fontSize: '0.7rem',
                  height: 22,
                  borderRadius: 1,
                }}
              />
            </Box>
          }
        />
      </ListItem>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            minWidth: '160px',
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <MenuItem
          onClick={handleOpenChat}
          sx={{
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              },
            },
          }}
        >
          <ListItemIcon>
            <ChatIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Abrir Conversa</ListItemText>
        </MenuItem>
      </Menu>
    </StyledPaper>
  );
}