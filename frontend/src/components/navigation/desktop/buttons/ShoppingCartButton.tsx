import { Badge, Button, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useShoppingCart } from '../../../../context/shoppingCart';

function ShoppingCartButton(): JSX.Element {
  const theme = useTheme();
  const secondaryTextColor = theme.palette.text.secondary;
  const infoColor = theme.palette.info.main;
  const { shoppingCart } = useShoppingCart();

  if (shoppingCart > 0) {
    return (
      <Badge color="error" badgeContent=" ">
        <Button
          href="/cart"
          variant="outlined"
          sx={{ color: infoColor, borderColor: secondaryTextColor }}
        >
          <ShoppingCartIcon />
        </Button>
      </Badge>
    );
  }

  return (
    <Button
      href="/cart"
      variant="outlined"
      sx={{ color: secondaryTextColor, borderColor: secondaryTextColor }}
    >
      <ShoppingCartIcon />
    </Button>
  );
}

export default ShoppingCartButton;
