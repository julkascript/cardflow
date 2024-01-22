import ProfilePublicData from '../../components/profile/ProfilePublicData';
import ProfileMarketActivity from '../../components/profile/profileMarketActivity/ProfileMarketActivity';
import ProfilePage from '../../components/profile/ProfilePage';
import { useLoaderData } from 'react-router-dom';
import { UserAccountLoader } from '../../services/user/types';

function ProfilePublicInfoPage(): JSX.Element {
  const results = useLoaderData() as UserAccountLoader;
  const user = results.data;
  return (
    <ProfilePage className="bg-[#F5F5F5]">
      <div className="flex flex-col gap-2">
        <ProfilePublicData user={user} />
        <ProfileMarketActivity />
      </div>
    </ProfilePage>
  );
}

export default ProfilePublicInfoPage;
