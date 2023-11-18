import { useTheme } from '@mui/material';

type PageSectionProps = {
  /**
   * Any additional classes that will be applied to the section
   */
  className?: string;
  children: React.ReactNode;

  /** Defaults to the secondary color of the theming */
  borderColor?: string;
};

/**
 * Renders a section with gray round corners, which stands out from the
 * background.
 */
function PageSection(props: PageSectionProps): JSX.Element {
  const className = props.className || '';
  const theme = useTheme();

  return (
    <section
      className={`rounded-lg bg-white ${className}`}
      style={{
        borderColor: props.borderColor || theme.palette.secondary.main,
        borderWidth: 1,
        borderStyle: 'solid',
      }}
    >
      {props.children}
    </section>
  );
}

export default PageSection;
