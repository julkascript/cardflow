import { Divider, Drawer, IconButton } from '@mui/material';
import Logo from '../logo/Logo';
import SearchField from '../searchField/SearchField';
import DesktopLoggedInNav from './desktop/DesktopLoggedInNav';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import MobileNavigation from './mobile/mobileNavigation';
import ShoppingCartButton from './desktop/buttons/ShoppingCartButton';

/**
 * A component for the application's navigation menu
 * @returns
 */
function Navigation(): JSX.Element {
  const [mobileMenuIsOpen, setMobileMenuOpen] = useState(false);

  function closeMenu(event: React.MouseEvent) {
    event.preventDefault();
    setMobileMenuOpen(false);
  }

  function openMenu() {
    setMobileMenuOpen(true);
  }

  return (
    <nav className="flex justify-between p-4 items-center">
      <a href="#">
        <Logo size={33} />
      </a>
      <div className="flex flex-row gap-4 items-center">
        <SearchField />
        <Divider flexItem orientation="vertical" />
        <ShoppingCartButton />
        <div className="hidden lg:flex lg:flex-row lg:gap-4 lg:items-center">
          <DesktopLoggedInNav />
        </div>
        <div className="block lg:hidden">
          <IconButton onClick={openMenu} aria-label="Open navigation menu">
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={mobileMenuIsOpen} onClose={() => setMobileMenuOpen(false)}>
            <MobileNavigation onClose={closeMenu}></MobileNavigation>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
