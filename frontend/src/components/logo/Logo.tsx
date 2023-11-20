import { useTheme } from '@mui/material';

type LogoProps = {
  /** Size is expressed in pixels */
  size: number;

  /** Defaults to ``'black'`` if not provided */
  color?: string;
};

/**
 * A SVG-based logo whose size and color can be configured with props
 * @param props
 * @returns
 */
function Logo(props: LogoProps): JSX.Element {
  const theme = useTheme();
  const tildaColor = theme.palette.success.main;

  const color = props.color || 'black';

  return (
    <svg width={props.size} height={props.size} aria-label="Cardflow logo">
      <rect width={props.size} height={props.size} fill={color} rx={5} ry={5}></rect>
      <text
        fill={tildaColor}
        textAnchor="middle"
        dominantBaseline="middle"
        x="50%"
        y="56%"
        fontSize={props.size / 1.1}
        className="select-none"
      >
        ~
      </text>
    </svg>
  );
}

export default Logo;
