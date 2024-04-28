import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { condition } from '../../services/yugioh/types';
import BreadcrumbNavigation, { BreadcrumbLink } from '../BreadcrumbNavigation';
import { Button, Checkbox, FormControlLabel } from '@mui/material';

type NewListingTopBarProps = {
  handleSubmit: (e: React.FormEvent, postAnother: boolean) => Promise<void>;
  quantity: number;
  price: number;
  condition: condition;
  card: number;
};

const NewListingTopBar: React.FC<NewListingTopBarProps> = ({
  handleSubmit,
  quantity,
  price,
  condition,
  card,
}) => {
  const [postAnother, setPostAnother] = useState(false);
  const navigate = useNavigate();
  const isButtonDisabled =
    quantity === null ||
    quantity === 0 ||
    price == null ||
    price === 0 ||
    price === undefined ||
    condition === null ||
    condition === undefined;
  card === null || card === undefined;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostAnother(e.target.checked);
  };

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, postAnother);
    if (!postAnother) {
      navigate('/sell/manage');
    } else {
      navigate('/sell/new');
    }
  };

  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      href: '/sell/manage',
      text: 'Sell',
    },
  ];

  return (
    <BreadcrumbNavigation links={breadcrumbNavigation} heading="New Listing">
      <div className="flex items-center px-16 gap-4">
        <FormControlLabel
          control={<Checkbox checked={postAnother} onChange={handleCheckboxChange} />}
          label="Post another"
        />
        <Button
          href="/sell/manage"
          variant="outlined"
          sx={{ borderRadius: 2, padding: '8px 24px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isButtonDisabled}
          color="success"
          variant="contained"
          sx={{ color: 'white', borderRadius: 2, padding: '8px 24px' }}
        >
          Post
        </Button>
      </div>
    </BreadcrumbNavigation>
  );
};

export default NewListingTopBar;
