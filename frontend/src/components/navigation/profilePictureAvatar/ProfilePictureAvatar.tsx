import { Avatar } from '@mui/material';

type ProfilePictureAvatar = {
  imageUrl?: string;
};

/**
 * An avatar image which links to the user's profile
 * @param props
 * @returns
 */
function ProfilePictureAvatar(props: ProfilePictureAvatar): JSX.Element {
  return (
    <a href="#">
      <Avatar src={props.imageUrl} />
    </a>
  );
}

export default ProfilePictureAvatar;
