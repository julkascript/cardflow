import { Typography, useTheme } from '@mui/material';

type color = 'gray' | 'red';

type ProfileSectionFooterProps = {
  /**
   * Defaults to ``gray`` if not passed
   */
  backgroundColor?: color;
  children: React.ReactNode;
};

type StyledFooter = {
  borderColor: string;
  backgroundColor: string;
};

function ProfileSectionFooter(props: ProfileSectionFooterProps): JSX.Element {
  const theme = useTheme();

  const colors: Record<color, StyledFooter> = {
    gray: {
      backgroundColor: '#F5F5F5',
      borderColor: theme.palette.secondary.main,
    },
    red: {
      backgroundColor: theme.palette.error.light,
      borderColor: theme.palette.error.light,
    },
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:justify-between">
      <Typography
        color="text.secondary"
        component="div"
        className="rounded-lg rounded-t-none w-full"
        sx={{
          backgroundColor: colors[props.backgroundColor || 'gray'].backgroundColor,
          borderTopWidth: 1,
          borderTopColor: colors[props.backgroundColor || 'gray'].borderColor,
        }}
      >
        <div className="flex p-4 pl-12 pr-12 flex-col lg:flex-row gap-2 justify-center lg:justify-between items-center">
          {props.children}
        </div>
      </Typography>
    </div>
  );
}

export default ProfileSectionFooter;
