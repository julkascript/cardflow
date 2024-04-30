import { Button, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ClearListingButton() {
  return (
    <>
      <div className="hidden lg:block">
        <Button size="small" href="/sell/new" variant="outlined" startIcon={<DeleteIcon />}>
          Clear
        </Button>
      </div>
      <div className="block lg:hidden mx-auto">
        <Tooltip title="Clear (discard) listing">
          <IconButton color="error" size="small" href="/sell/new">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}

export default ClearListingButton;
