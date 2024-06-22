import { Button, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

function ClearListingButton() {
  const { t } = useTranslation('sell');
  return (
    <>
      <div className="hidden lg:block">
        <Button
          className="w-full"
          size="small"
          href="/sell/new"
          variant="outlined"
          startIcon={<DeleteIcon />}
        >
          {t('newListing.secondSection.clearButtonText')}
        </Button>
      </div>
      <div className="block lg:hidden mx-auto">
        <Tooltip title={t('newListing.secondSection.clearButtonTooltip')}>
          <IconButton color="error" size="small" href="/sell/new">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}

export default ClearListingButton;
