import { Button } from '@mui/material';
import PageSection from '../../../pageSection/PageSection';
import ProfileSectionFooter from '../../profileSectionFooter/ProfileSectionFooter';

function DeleteAccount(): JSX.Element {
  return (
    <PageSection>
      <div className="pt-4 pb-4 lg:pl-12 lg:pr-12">
        <h2 className="font-bold mb-4 text-lg">Delete your account</h2>
        <p>
          Permanently remove your Cardflow account. Please proceed with caution, this action is
          irreversible.
        </p>
      </div>
      <ProfileSectionFooter backgroundColor="#fff0f0">
        <p>You can always change the address per purchase in the checkout section.</p>
        <Button color="warning" variant="contained" className="inline-block">
          Delete Account
        </Button>
      </ProfileSectionFooter>
    </PageSection>
  );
}

export default DeleteAccount;
