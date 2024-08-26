import { Button, Menu, MenuItem } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import LensIcon from '@mui/icons-material/Lens';
import React from 'react';

type ActionButton = {
  color?: 'error' | 'inherit' | 'primary' | 'secondary' | 'success' | 'info' | 'warning';
  text: string;
  disabled?: boolean;
  onClick: (event?: React.MouseEvent) => void;
};

type ActionMenuItem = {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
};

export type TableActions = [ActionButton, ActionButton, ...ActionMenuItem[]];

type TableActionsMenuProps = {
  /**
   * The first two buttons are always visible and the rest
   * are rendered as menu items
   */
  actions: TableActions;
  selectedItemsCount: number;

  /**
   * In the translation matching this key, you can wrap text (such as the number
   * itself) in a <strong> tag which will be replaced by the HTML tag
   * during render.
   *
   * The translation file can also use the ``count`` interpolation value
   * to render different texts based on the passed item count, as well as
   * interpolate the count itself.
   */
  itemsCountTranslationKey: string;

  /**
   * This is the name of the translation file from which translations
   * about the amount of selected items will be retrieved.
   * Use ``itemsCountTranslationKey`` to provide the specific translation
   * within that namespace
   */
  itemsCountNamespace: string;
};

function TableActionsMenu(props: TableActionsMenuProps): JSX.Element {
  const [firstAction, secondAction, ...menuItems] = props.actions;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function openMenu(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  }

  function closeMenu(event: React.MouseEvent) {
    event.preventDefault();
    setAnchorEl(null);
  }

  const FirstButton = createActionButton(firstAction);
  const SecondButton = createActionButton(secondAction);
  const { t } = useTranslation(props.itemsCountNamespace);

  return (
    <div className="text-center bg-white self-center mb-4 mt-4 w-96 border-[#666666] border rounded-md">
      <p className="pt-4">
        <Trans
          t={t}
          i18nKey={props.itemsCountTranslationKey}
          count={props.selectedItemsCount}
          components={{ strong: <strong /> }}
        ></Trans>
      </p>
      <div className="flex justify-between p-4">
        {FirstButton}
        {SecondButton}
        <Button
          className="font-bold rounded-md flex gap-1 items-center justify-center"
          variant="outlined"
          onClick={openMenu}
        >
          <LensIcon sx={{ fontSize: 6 }} color="secondary" />
          <LensIcon sx={{ fontSize: 6 }} color="secondary" />
          <LensIcon sx={{ fontSize: 6 }} color="secondary" />
        </Button>
        <Menu open={open} anchorEl={anchorEl} onClose={closeMenu}>
          {menuItems.map((mi) => {
            const MenuItem = () => createMenuItem(mi);

            return <MenuItem key={mi.text} />;
          })}
        </Menu>
      </div>
    </div>
  );
}

export default TableActionsMenu;

function createActionButton(props: ActionButton): JSX.Element {
  return (
    <Button
      variant="outlined"
      color={props.color}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.text}
    </Button>
  );
}

function createMenuItem(props: ActionMenuItem): JSX.Element {
  return (
    <MenuItem disabled={props.disabled} onClick={props.onClick}>
      {props.text}
    </MenuItem>
  );
}
