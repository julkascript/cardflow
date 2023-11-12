import ProfileNavigation from '../../components/profile/ProfileNavigation';

function ProfilePage(): JSX.Element {
  return (
    <section>
      <header>
        <h1>Account</h1>
      </header>
      <div>
        <ProfileNavigation />
        <h1>test</h1>
      </div>
    </section>
  );
}

export default ProfilePage;
