import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { LinkProps } from '@mui/material/Link';
import React from 'react';

const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

/**
 * A configuration object for integrating React Router
 * with MUI's components. This configures various components
 * to use React Router's ``Link`` component instead of a standard ``a`` tag
 * when they have to be used as hyperlinks.
 *
 * **Note:** MUI components' ``href`` props typically accept only strings,
 * so this setup won't work with more complex types without TypeScript complaining.
 */
export const linkBehaviorConfiguration = {
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
};
