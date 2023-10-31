import { Avatar } from '@mui/material';

interface IProfilePictureAvatar {
  imageUrl?: string;
}

/**
 * An avatar image which links to the user's profile
 * @param props
 * @returns
 */
function ProfilePictureAvatar(props: IProfilePictureAvatar): JSX.Element {
  return (
    <a href="#">
      <Avatar src={props.imageUrl} />
    </a>
  );
}

export default ProfilePictureAvatar;
