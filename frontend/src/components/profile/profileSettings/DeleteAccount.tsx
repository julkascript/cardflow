import { Button, useTheme } from '@mui/material';
import PageSection from '../../PageSection';
import ProfileSectionFooter from '../ProfileSectionFooter';

type DeleteAccountProps = {
  onDelete: () => void;
};

function DeleteAccount(props: DeleteAccountProps): JSX.Element {
  const theme = useTheme();
  return (
    <PageSection borderColor={theme.palette.error.light}>
      <div className="pt-4 pb-4 lg:pl-12 lg:pr-12">
        <h2 className="font-bold mb-4 text-lg">Delete your account</h2>
        <p>
          Permanently remove your Cardflow account. Please proceed with caution, this action is
          irreversible.
        </p>
      </div>
      <ProfileSectionFooter backgroundColor="red">
        <p>We will definitely miss you...</p>
        <Button onClick={props.onDelete} color="error" variant="contained" className="inline-block">
          Delete Account
        </Button>
      </ProfileSectionFooter>
    </PageSection>
  );
}

export default DeleteAccount;
