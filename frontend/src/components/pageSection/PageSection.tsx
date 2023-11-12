type PageSectionProps = {
  /**
   * Any additional classes that will be applied to the section
   */
  className?: string;
  children: React.ReactNode;
};

/**
 * Renders a section with gray round corners, which stands out from the
 * background.
 */
function PageSection(props: PageSectionProps): JSX.Element {
  const className = props.className || '';

  return (
    <section className={`border-stone-300 border-2 rounded-lg ${className}`}>
      {props.children}
    </section>
  );
}

export default PageSection;
