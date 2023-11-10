import { Avatar, Link } from '@mui/material';

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
    <Link href="/profile">
      <Avatar src={props.imageUrl} />
    </Link>
  );
}

export default ProfilePictureAvatar;
