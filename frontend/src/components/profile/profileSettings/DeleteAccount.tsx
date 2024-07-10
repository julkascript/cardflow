import { Button, useTheme } from '@mui/material';
import PageSection from '../../PageSection';
import ProfileSectionFooter from '../ProfileSectionFooter';
import { useTranslation } from 'react-i18next';

type DeleteAccountProps = {
  onDelete: () => void;
};

function DeleteAccount(props: DeleteAccountProps): JSX.Element {
  const { t } = useTranslation('account');
  const theme = useTheme();
  return (
    <PageSection borderColor={theme.palette.error.light}>
      <div className="pt-4 pb-4 lg:pl-12 lg:pr-12">
        <h2 className="font-bold mb-4 text-lg">{t('details.deleteAccount.title')}</h2>
        <p>{t('details.deleteAccount.description')}</p>
      </div>
      <ProfileSectionFooter backgroundColor="red">
        <p>{t('details.deleteAccount.hint')}</p>
        <Button onClick={props.onDelete} color="error" variant="contained" className="inline-block">
          {t('details.deleteAccount.deleteAccountButtonText')}
        </Button>
      </ProfileSectionFooter>
    </PageSection>
  );
}

export default DeleteAccount;
