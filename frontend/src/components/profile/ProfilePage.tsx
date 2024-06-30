import { useTranslation } from 'react-i18next';
import PageHeader from '../PageHeader';
import ProfileNavigation from './ProfileNavigation';

type ProfileSectionProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * A wrapper for profile pages with some preconfigured styling.
 * Includes the profile navigation and the content you pass.
 * @param props
 * @returns
 */
function ProfilePage(props: ProfileSectionProps): JSX.Element {
  const className = props.className || '';
  const { t } = useTranslation('account');

  return (
    <section className={className}>
      <PageHeader heading={t('common.account')}></PageHeader>
      <div className="block text-center p-8 lg:text-left lg:grid lg:grid-cols-[1fr_3fr] lg:p-24 lg:place-item">
        <ProfileNavigation />
        {props.children}
      </div>
    </section>
  );
}

export default ProfilePage;
