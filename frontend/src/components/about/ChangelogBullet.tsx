import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type changelogBullet = 'feature' | 'fix' | 'deprecation';

type ChangelogIcon = {
  BulletIcon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string;
  };
  color: 'info' | 'success' | 'error';
};

type ChangeLogBulletProps = {
  type: changelogBullet;
};

const icons: Record<changelogBullet, ChangelogIcon> = {
  fix: {
    BulletIcon: AddCircleIcon,
    color: 'info',
  },
  feature: {
    BulletIcon: CheckCircleIcon,
    color: 'success',
  },
  deprecation: {
    BulletIcon: ErrorIcon,
    color: 'error',
  },
};

function ChangelogBullet(props: ChangeLogBulletProps): JSX.Element {
  const { BulletIcon, color } = icons[props.type];

  return <BulletIcon fontSize="small" color={color} />;
}

export default ChangelogBullet;
