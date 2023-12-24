import { Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function AddToCardButton(): JSX.Element {
  return (
    <Button
      color="success"
      sx={{
        backgroundColor: '#15B58D',
        borderColor: '#3A3A3A',
        color: 'white',
        ':hover': {
          color: 'black',
        },
      }}
      aria-label="Add to cart"
      size="small"
      className="border h-10 w-14"
    >
      <ShoppingCartIcon />
    </Button>
  );
}

export default AddToCardButton;
