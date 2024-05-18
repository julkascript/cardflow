import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, IconButton, Tooltip } from '@mui/material';

type ToggleVisibilityButtonProps = {
  public: boolean;
  onClick: () => void;
};

function ToggleVisibilityButton(props: ToggleVisibilityButtonProps): JSX.Element {
  return (
    <>
      <div className="hidden lg:block">
        <Button
          startIcon={<VisibilityIcon />}
          size="small"
          variant="outlined"
          onClick={props.onClick}
          className="w-full"
        >
          {props.public ? 'List' : 'Delist'}
        </Button>
      </div>
      <div className="block lg:hidden mx-auto">
        <Tooltip title={props.public ? 'Delist' : 'Make listing public'} onClick={props.onClick}>
          <IconButton size="small" color={props.public ? 'info' : 'secondary'}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}

export default ToggleVisibilityButton;
