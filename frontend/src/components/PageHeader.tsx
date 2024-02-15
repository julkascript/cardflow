type PageHeaderProps = {
  /**
   * Additional class names to be added to the parent tag
   */
  className?: string;

  /**
   * Any content (e.g. action buttons) which will be placed
   * on the other end of the page header.
   */
  children?: React.ReactNode | null;

  heading: React.ReactNode;
};

/**
 * Displays the header of the page, featuring the heading.
 * Pass any content as ``children`` to place it on the other end of
 * the header.
 * @param props
 * @returns
 */
function PageHeader(props: PageHeaderProps): JSX.Element {
  const className = props.className || '';

  const heading =
    typeof props.heading === 'string' ? (
      <h1 className="text-3xl font-bold">{props.heading}</h1>
    ) : (
      props.heading
    );

  return (
    <header
      className={`lg:pl-24 gap-4 lg:gap-0 flex flex-col items-center justify-center lg:justify-between lg:flex-row pb-8 pt-8 border-b-2 border-stone-300 text-center lg:text-left bg-white ${className}`}
    >
      {heading}
      <div className="lg:pr-8">{props.children}</div>
    </header>
  );
}

export default PageHeader;
