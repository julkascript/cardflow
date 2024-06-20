import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * A list of navigation items for guests.
 * This component should be rendered on large screens only.
 * @returns
 */
function DesktopGuestNav(): JSX.Element {
  const { t } = useTranslation('common');

  return (
    <ul className="list-none">
      <li className="md:inline-block">
        <Button href="/register" color="primary" variant="contained">
          {t('navigation.signUp')}
        </Button>
      </li>
    </ul>
  );
}

export default DesktopGuestNav;
