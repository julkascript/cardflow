import { useTheme } from '@mui/material';

type LogoProps = {
  size: number;
  color?: string;
};

/**
 * A SVG-based logo whose size and color can be configured with props
 * @param props
 * @returns
 */
function Logo(props: LogoProps): JSX.Element {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  const color = props.color || 'black';

  return (
    <svg width={props.size} height={props.size} aria-label="Cardflow logo">
      <rect width={props.size} height={props.size} fill={color} rx={5} ry={5}></rect>
      <text
        fill={secondary}
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
