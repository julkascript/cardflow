import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

type ToggleVisibilityButtonProps = {
  public: boolean;
  onClick: () => void;
};

function ToggleVisibilityButton(props: ToggleVisibilityButtonProps): JSX.Element {
  const { t } = useTranslation('sell');
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
          {t('newListing.secondSection.visibilityButtonText', {
            context: props.public.toString(),
          })}
        </Button>
      </div>
      <div className="block lg:hidden mx-auto">
        <Tooltip
          title={t('newListing.secondSection.visibilityButtonTooltipText', {
            context: props.public.toString(),
          })}
          onClick={props.onClick}
        >
          <IconButton size="small" color={props.public ? 'info' : 'secondary'}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}

export default ToggleVisibilityButton;
