import { ChangeEvent, FormEvent, useState } from 'react';
import PageSection from '../../PageSection';
import ProfileSectionFooter from '../ProfileSectionFooter';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

type ShipmentAddressSettingsProps = {
  address: string | null;
  onSubmit: (address: string) => void;
};

function ShipmentAddressSettings(props: ShipmentAddressSettingsProps): JSX.Element {
  const [address, setAddress] = useState(props.address || '');
  const { t } = useTranslation('account');

  function handleAddressChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value;
    setAddress(value);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    props.onSubmit(address);
  }

  return (
    <PageSection>
      <form onSubmit={handleSubmit}>
        <div className="pt-4 pb-4 lg:pl-12 lg:pr-12">
          <h2 className="font-bold mb-4 text-lg">{t('details.defaultShipmentAddress.title')}</h2>
          <p className="mb-4">{t('details.defaultShipmentAddress.description')}</p>
          <TextField value={address} onChange={handleAddressChange} size="small" />
        </div>
        <ProfileSectionFooter>
          <p>{t('details.defaultShipmentAddress.hint')}</p>
          <Button
            disabled={address === '' || address === props.address}
            color="primary"
            variant="contained"
            className="inline-block"
            type="submit"
          >
            {t('common.saveButtonText')}
          </Button>
        </ProfileSectionFooter>
      </form>
    </PageSection>
  );
}

export default ShipmentAddressSettings;
