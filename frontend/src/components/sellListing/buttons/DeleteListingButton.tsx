import { Button, IconButton, Tooltip } from '@mui/material';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { useTranslation } from 'react-i18next';

type DeleteListingButtonProps = {
  onClick: () => void;
};

function DeleteListingButton(props: DeleteListingButtonProps): JSX.Element {
  const { t } = useTranslation('sell');
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
          {t('newListing.secondSection.deleteButtonText')}
        </Button>
      </div>
      <div className="block lg:hidden mx-auto">
        <Tooltip
          title={t('newListing.secondSection.deleteButtonTooltipText')}
          onClick={props.onClick}
        >
          <IconButton size="small">
            <DoNotDisturbAltIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}

export default DeleteListingButton;
