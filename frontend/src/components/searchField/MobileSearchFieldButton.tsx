import Search from '@mui/icons-material/Search';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import MobileSearchField from './MobileSearchField';
import { useEffectAfterInitialLoad } from '../../util/useEffectAfterInitialLoad';
import { useLocation } from 'react-router-dom';

function MobileSearchFieldButton(): JSX.Element {
  const grayColor = 'rgba(148, 148, 148, 0.3)';
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffectAfterInitialLoad(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <Tooltip title="Search cards by name">
        <IconButton sx={{ background: grayColor }} onClick={() => setOpen(true)}>
          <Search />
        </IconButton>
      </Tooltip>
      <MobileSearchField open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default MobileSearchFieldButton;
