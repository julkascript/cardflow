import Search from '@mui/icons-material/Search';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import MobileSearchField from './MobileSearchField';
import { useEffectAfterInitialLoad } from '../../util/useEffectAfterInitialLoad';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function MobileSearchFieldButton(): JSX.Element {
  const grayColor = 'rgba(148, 148, 148, 0.3)';
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation('common');

  useEffectAfterInitialLoad(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <Tooltip title={t('search.openSearchToolTip')}>
        <IconButton sx={{ background: grayColor }} onClick={() => setOpen(true)}>
          <Search />
        </IconButton>
      </Tooltip>
      <MobileSearchField open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default MobileSearchFieldButton;
