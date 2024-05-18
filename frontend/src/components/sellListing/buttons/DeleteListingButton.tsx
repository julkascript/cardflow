import { Button, IconButton, Tooltip } from '@mui/material';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';

type DeleteListingButtonProps = {
  onClick: () => void;
};

function DeleteListingButton(props: DeleteListingButtonProps): JSX.Element {
  return (
    <>
      <div className="hidden lg:block">
        <Button
          className="w-full"
          size="small"
          color="error"
          variant="outlined"
          onClick={props.onClick}
        >
          Delete
        </Button>
      </div>
      <div className="block lg:hidden mx-auto">
        <Tooltip title="Delete this listing" onClick={props.onClick}>
          <IconButton size="small">
            <DoNotDisturbAltIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}

export default DeleteListingButton;
