import { Button, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function ShoppingCartButton(): JSX.Element {
  const theme = useTheme();
  const secondaryTextColor = theme.palette.text.secondary;

  return (
    <Button
      href="#"
      variant="outlined"
      sx={{ color: secondaryTextColor, borderColor: secondaryTextColor }}
    >
      <ShoppingCartIcon />
    </Button>
  );
}

export default ShoppingCartButton;
