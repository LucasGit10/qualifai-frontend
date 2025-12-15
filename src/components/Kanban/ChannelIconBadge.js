import { Badge, Avatar, Tooltip } from '@mui/material';
import { getChannelIcon } from './utils/channelUtils';
import { Person as PersonIcon, HelpOutline as HelpOutlineIcon } from '@mui/icons-material';

export default function ChannelIconBadge({ channel, name }) {
  const badgeIcon = getChannelIcon(channel, { fontSize: 'small' }) || <HelpOutlineIcon fontSize="small" />;

  return (
    <Tooltip title={channel}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={badgeIcon}
      >
        <Avatar sx={{
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
        }}>
          {name ? name.charAt(0).toUpperCase() : <PersonIcon />}
        </Avatar>
      </Badge>
    </Tooltip>
  );
}