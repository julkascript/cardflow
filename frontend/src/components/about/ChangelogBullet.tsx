import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type changelogBullet = 'feature' | 'fix' | 'deprecation';

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
    color: 'success',
  },
  feature: {
    BulletIcon: CheckCircleIcon,
    color: 'info',
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
