import PageHeader from '../../components/pageHeader/PageHeader';
import ProfileNavigation from '../../components/profile/ProfileNavigation';
import ProfilePublicData from '../../components/profile/ProfilePublicData';
import ProfileMarketActivity from '../../components/profile/profileMarketActivity/ProfileMarketActivity';
function ProfilePublicInfoPage(): JSX.Element {
  return (
    <section>
      <PageHeader heading="Account"></PageHeader>
      <div className="block text-center p-8 lg:text-left lg:grid lg:grid-cols-[1fr_3fr] lg:p-24">
        <ProfileNavigation />
        <div className="flex flex-col gap-2">
          <ProfilePublicData />
          <ProfileMarketActivity />
        </div>
      </div>
    </section>
  );
}

export default ProfilePublicInfoPage;
