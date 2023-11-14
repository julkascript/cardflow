import { ChangeEvent, useState } from 'react';
import PageSection from '../../../pageSection/PageSection';
import ProfileSectionFooter from '../../profileSectionFooter/ProfileSectionFooter';
import { Button, TextField } from '@mui/material';

function ShipmentAddressSettings(): JSX.Element {
  const [address, setAddress] = useState('');

  function handleAddressChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value;
    setAddress(value);
  }

  return (
    <PageSection>
      <div className="pt-4 pb-4 lg:pl-12 lg:pr-12">
        <h2 className="font-bold mb-4 text-lg">Default shipment address</h2>
        <p className="mb-4 text-lg">Enter the default shipment address that will get pre-filled.</p>
        <TextField value={address} onChange={handleAddressChange} size="small" />
      </div>
      <ProfileSectionFooter>
        <p>You can always change the address per purchase in the checkout section.</p>
        <Button
          disabled={address === ''}
          color="primary"
          variant="contained"
          className="inline-block"
        >
          Save
        </Button>
      </ProfileSectionFooter>
    </PageSection>
  );
}

export default ShipmentAddressSettings;
