import { IconButton, useTheme } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

function NotificationButton(): JSX.Element {
  const theme = useTheme();
  const secondaryTextColor = theme.palette.text.secondary;
  return (
    <IconButton
      size="small"
      sx={{ borderWidth: 1, borderColor: secondaryTextColor, borderStyle: 'solid' }}
    >
      <NotificationsIcon />
    </IconButton>
  );
}

export default NotificationButton;
