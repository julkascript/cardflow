import { useState } from 'react';
import ProfilePage from '../../components/profile/ProfilePage';
import AvatarSettings from '../../components/profile/profileSettings/avatarSettings/AvatarSettings';
import DeleteAccount from '../../components/profile/profileSettings/DeleteAccount';
import EmailSettings from '../../components/profile/profileSettings/EmailSettings';
import ShipmentAddressSettings from '../../components/profile/profileSettings/ShipmentAddressSettings';
import UsernameSettings from '../../components/profile/profileSettings/usernameSettings/UsernameSettings';
import { useCurrentUser } from '../../context/user';
import { UserAccount } from '../../services/user/types';
import { userService } from '../../services/user/user';
import { useLogout } from '../../util/useLogout';
import toast from 'react-hot-toast';
import { legacyToastMessages } from '../../constants/toast';
import { legacyErrorToast } from '../../util/errorToast';

function ProfileSettingsPage(): JSX.Element {
  const { user, setUser } = useCurrentUser();
  const logout = useLogout();

  const [hasSelectedAnAvatar, setSelectedAvatar] = useState(false);

  async function updateAccount(section: keyof UserAccount, data: string, toastMessage?: string) {
    const payload: Partial<UserAccount> = { [section]: data };
    return userService
      .updateUser(user.user_id, payload)
      .then((data) => {
        setUser({ user_id: user.user_id, ...data });
        if (toastMessage) {
          toast.success(toastMessage);
        }
      })
      .catch(legacyErrorToast);
  }

  function updateAndLogout(field: 'username' | 'email', value: string) {
    updateAccount(field, value).then(() => {
      logout();
      toast.success(
        field === 'username'
          ? legacyToastMessages.success.usernameChanged
          : legacyToastMessages.success.emailChanged,
      );
    });
  }

  function deleteAccount() {
    userService
      .deleteUser(user.user_id)
      .then(() => {
        logout();
        toast.success(legacyToastMessages.success.accountDeleted);
      })
      .catch(legacyErrorToast);
  }

  function updateAvatar(avatar: File) {
    userService
      .updateUserAvatar(user.user_id, avatar)
      .then((data) => {
        setSelectedAvatar(false);
        setUser({ user_id: user.user_id, ...data });
        toast.success(legacyToastMessages.success.avatarChanged);
      })
      .catch(legacyErrorToast);
  }

  return (
    <ProfilePage className="bg-[#F5F5F5]">
      <div className="flex flex-col gap-8">
        <AvatarSettings
          hasSelected={hasSelectedAnAvatar}
          onSelect={setSelectedAvatar}
          key={user?.avatar + '0'}
          avatar={user.avatar}
          onSubmit={updateAvatar}
        />
        <UsernameSettings
          onSubmit={(u) => updateAndLogout('username', u)}
          key={user.username + '1'}
          username={user.username}
        />
        <EmailSettings
          onSubmit={(e) => updateAndLogout('email', e)}
          key={user.email + '2'}
          email={user.email}
        />
        <ShipmentAddressSettings
          address={user.shipping_address}
          onSubmit={(a) =>
            updateAccount('shipping_address', a, legacyToastMessages.success.shipmentAddressChanged)
          }
          key={user.shipping_address + '3'}
        />
        <DeleteAccount onDelete={deleteAccount} />
      </div>
    </ProfilePage>
  );
}

export default ProfileSettingsPage;
