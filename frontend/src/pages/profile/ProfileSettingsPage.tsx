import ProfilePage from '../../components/profile/ProfilePage';
import AvatarSettings from '../../components/profile/profileSettings/avatarSettings/AvatarSettings';
import DeleteAccount from '../../components/profile/profileSettings/DeleteAccount';
import EmailSettings from '../../components/profile/profileSettings/EmailSettings';
import ShipmentAddressSettings from '../../components/profile/profileSettings/ShipmentAddressSettings';
import UsernameSettings from '../../components/profile/profileSettings/usernameSettings/UsernameSettings';

function ProfileSettingsPage(): JSX.Element {
  return (
    <ProfilePage className="bg-[#F5F5F5]">
      <div className="flex flex-col gap-8">
        <AvatarSettings />
        <UsernameSettings />
        <EmailSettings />
        <ShipmentAddressSettings />
        <DeleteAccount />
      </div>
    </ProfilePage>
  );
}

export default ProfileSettingsPage;
