import { Link } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

type ExpandOfferProps = {
  onExpandOffer: () => void;
};

function ExpandOffer(props: ExpandOfferProps): JSX.Element {
  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    props.onExpandOffer();
  }

  const { t } = useTranslation('trade');

  return (
    <Link
      sx={{ color: '#0072f5' }}
      underline="hover"
      className="self-end"
      role="button"
      fontSize="small"
      href="#"
      onClick={handleClick}
    >
      {t('details.chat.expandOffer')}
    </Link>
  );
}

export default ExpandOffer;
