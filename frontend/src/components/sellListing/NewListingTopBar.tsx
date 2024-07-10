import React, { useState } from 'react';
import BreadcrumbNavigation, { BreadcrumbLink } from '../BreadcrumbNavigation';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

type NewListingTopBarProps = {
  handleSubmit: (e: React.FormEvent, postAnother: boolean) => Promise<void>;
  quantity: number;
  price: number;
  title: string;
};

const NewListingTopBar: React.FC<NewListingTopBarProps> = ({
  handleSubmit,
  quantity,
  price,
  title,
}) => {
  const [postAnother, setPostAnother] = useState(false);
  const isButtonDisabled = !price || !quantity;

  const { t } = useTranslation('sell');
  const { t: commonT } = useTranslation('common');

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostAnother(e.target.checked);
  };

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, postAnother);
  };

  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      href: '/sell/manage',
      text: commonT('breadcrumbs.sell.title'),
    },
  ];

  return (
    <BreadcrumbNavigation links={breadcrumbNavigation} heading={title}>
      <div className="flex items-center px-16 gap-4">
        <FormControlLabel
          control={<Checkbox checked={postAnother} onChange={handleCheckboxChange} />}
          label={t('newListing.postAnotherCheckboxLabel')}
        />
        <Button
          href="/sell/manage"
          variant="outlined"
          sx={{ borderRadius: 2, padding: '8px 24px' }}
        >
          {t('newListing.cancelButtonText')}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isButtonDisabled}
          color="success"
          variant="contained"
          sx={{ color: 'white', borderRadius: 2, padding: '8px 24px' }}
        >
          {t('newListing.postButtonText')}
        </Button>
      </div>
    </BreadcrumbNavigation>
  );
};

export default NewListingTopBar;
