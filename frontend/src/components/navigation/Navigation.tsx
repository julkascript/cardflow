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

/**
 * A component for the application's navigation menu
 * @returns
 */
function Navigation(): JSX.Element {
  const [mobileMenuIsOpen, setMobileMenuOpen] = useState(false);

  function closeMenu(event?: React.MouseEvent) {
    event?.preventDefault();
    setMobileMenuOpen(false);
  }

  function openMenu() {
    setMobileMenuOpen(true);
  }

  return (
    <nav className="flex justify-between p-4 items-center relative z-5000">
      <div className="block lg:hidden">
        <IconButton onClick={openMenu} aria-label="Open navigation menu">
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={mobileMenuIsOpen} onClose={() => setMobileMenuOpen(false)}>
          <MobileNavigation onCloseButtonClick={closeMenu}></MobileNavigation>
        </Drawer>
      </div>
      <Link to="/">
        <Logo size={33} />
      </Link>
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
