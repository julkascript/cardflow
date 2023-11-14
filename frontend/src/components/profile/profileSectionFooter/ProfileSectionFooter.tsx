import { Typography } from '@mui/material';

type ProfileSectionFooterProps = {
  /**
   * Defaults to ``#F5F5F5`` if not passed
   */
  backgroundColor?: string;
  children: React.ReactNode;
};

function ProfileSectionFooter(props: ProfileSectionFooterProps): JSX.Element {
  const bgColor = props.backgroundColor || '#F5F5F5';

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:justify-between">
      <Typography
        color="text.secondary"
        component="div"
        className={`bg-[${bgColor}] rounded-lg rounded-t-none w-full`}
      >
        <div className="flex p-4 pl-12 pr-12 flex-col lg:flex-row gap-2 justify-center lg:justify-between items-center">
          {props.children}
        </div>
      </Typography>
    </div>
  );
}

export default ProfileSectionFooter;
