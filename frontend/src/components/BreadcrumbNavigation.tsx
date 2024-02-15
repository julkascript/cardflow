import React from 'react';
import PageHeader from './PageHeader';
import { Breadcrumbs, Link, Typography } from '@mui/material';

export type BreadcrumbLink = {
  text: string;
  /**
   * href should be relative (e.g. ``/sell``);
   */
  href: string;
};

type BreadcrumbNavigationProps = {
  links: BreadcrumbLink[];
  heading: React.ReactNode;
  children?: React.ReactNode | null;
};

const fontSize = '1.875rem';
const lineHeight = '2.25rem';

/*
 *  Standard separator from MUI doesn't scale alongside
 *  the links/text's size, so using this
 *  as a custom separator.
 */
function Separator(): JSX.Element {
  return <span className="text-3xl">/</span>;
}

function BreadcrumbNavigation(props: BreadcrumbNavigationProps): JSX.Element {
  const BreadcrumbLinks = (
    <Breadcrumbs className="breadcrumb-navigation" separator={<Separator />}>
      {props.links.map((l) => (
        <Link
          fontSize={fontSize}
          key={l.text + l.href}
          underline="hover"
          color="inherit"
          href={l.href}
          className="flex justify-self-start"
          lineHeight={lineHeight}
        >
          {l.text}
        </Link>
      ))}

      <Typography
        component="h1"
        className="m-0 p-0 inline align-middle"
        fontSize={fontSize}
        color="text.primary"
        lineHeight={lineHeight}
      >
        {props.heading}
      </Typography>
    </Breadcrumbs>
  );

  return <PageHeader heading={BreadcrumbLinks}>{props.children}</PageHeader>;
}

export default BreadcrumbNavigation;
