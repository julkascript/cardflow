import { Divider, Drawer, IconButton } from '@mui/material';
import Logo from '../logo/Logo';
import SearchField from '../searchField/SearchField';
import DesktopLoggedInNav from './desktop/DesktopLoggedInNav';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import MobileNavigation from './mobile/MobileNavigation';
import ShoppingCartButton from './desktop/buttons/ShoppingCartButton';
import { Link } from 'react-router-dom';
import Authorized from '../../router/Authorized';
import Unauthorized from '../../router/Unauthorized';
import DesktopGuestNav from './desktop/DesktopGuestNav';
import MobileSearchFieldButton from '../searchField/MobileSearchFieldButton';
import { useTranslation } from 'react-i18next';
import LanguageMenu from './LanguageMenu';

/**
 * A component for the application's navigation menu
 * @returns
 */
function Navigation(): JSX.Element {
  const [mobileMenuIsOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation('common');

  function closeMenu(event?: React.MouseEvent) {
    event?.preventDefault();
    setMobileMenuOpen(false);
  }

  function openMenu() {
    setMobileMenuOpen(true);
  }

  return (
    <nav className="flex justify-between p-4 items-center relative z-5000">
      <div className="relative lg:hidden">
        <IconButton onClick={openMenu} aria-label={t('navigation.openMenuAriaLabel')}>
          <MenuIcon />
        </IconButton>
        <div className="absolute top-1 left-12">
          <LanguageMenu />
        </div>
        <Drawer anchor="left" open={mobileMenuIsOpen} onClose={() => setMobileMenuOpen(false)}>
          <MobileNavigation onCloseButtonClick={closeMenu}></MobileNavigation>
        </Drawer>
      </div>
      <div className="flex gap-4">
        <Link to="/">
          <Logo size={33} />
        </Link>
        <div className="hidden lg:block">
          <LanguageMenu />
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <div className="hidden lg:block">
          <SearchField />
        </div>
        <Divider className="hidden lg:block" flexItem orientation="vertical" />
        <Authorized>
          <ShoppingCartButton />
          <div className="hidden lg:flex lg:flex-row lg:gap-4 lg:items-center">
            <DesktopLoggedInNav />
          </div>
        </Authorized>
        <Unauthorized>
          <div className="hidden lg:flex lg:flex-row lg:gap-4 lg:items-center">
            <DesktopGuestNav />
          </div>
        </Unauthorized>
        <div className="block lg:hidden">
          <MobileSearchFieldButton />
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
