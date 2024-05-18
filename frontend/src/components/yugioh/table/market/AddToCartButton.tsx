import { Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

type AddToCartButtonProps = {
  hidden: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function AddToCardButton(props: AddToCartButtonProps): JSX.Element {
  if (props.hidden) {
    return <div aria-hidden={true} className="h-10 w-14 invisible"></div>;
  }
  return (
    <>
      <div className="hidden lg:block">
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
          onClick={props.onClick}
        >
          <ShoppingCartIcon />
        </Button>
      </div>
      <div className="block lg:hidden">
        <Button
          color="success"
          sx={{
            backgroundColor: '#15B58D',
            borderColor: '#3A3A3A',
            color: 'white',
            padding: 2,
            borderRadius: 5,
            ':hover': {
              color: 'black',
            },
          }}
          aria-label="Add to cart"
          size="small"
          className="border h-5"
          onClick={props.onClick}
        >
          <ShoppingCartIcon />
        </Button>
      </div>
    </>
  );
}

export default AddToCardButton;
