import { Link } from '@mui/material';
import React from 'react';

type ExpandOfferProps = {
  onExpandOffer: () => void;
};

function ExpandOffer(props: ExpandOfferProps): JSX.Element {
  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    props.onExpandOffer();
  }

  return (
    <Link sx={{ color: '#0072f5' }} underline="hover" role="button" href="#" onClick={handleClick}>
      Click to expand offer...
    </Link>
  );
}

export default ExpandOffer;
