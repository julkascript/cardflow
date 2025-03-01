import { NavLink, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../context/user';
import { useTranslation } from 'react-i18next';

type ProfileLinks = {
  href: string;
  text: string;
};

function ProfileNavigation(): JSX.Element {
  const { t } = useTranslation('account');

  function isActive({ isActive }: { isActive: boolean }) {
    return isActive ? 'font-bold hover:underline' : 'hover:underline';
  }

  function AccountDetailsLink(username: string, currentUsername: string): JSX.Element {
    if (username.toLowerCase() !== currentUsername.toLowerCase()) {
      return <></>;
    }

    return (
      <li className="mb-2">
        <NavLink end to={`/user/${username}/settings`} className={isActive}>
          {t('common.navigation.details')}
        </NavLink>
      </li>
    );
  }

  const params = useParams();
  const username = params.username || '';
  const { user } = useCurrentUser();
  const DetailsLink = () => AccountDetailsLink(username, user.username);

  const links: ProfileLinks[] = [
    {
      href: `/user/${username}`,
      text: t('common.navigation.public'),
    },
    {
      href: `/user/${username}/listings`,
      text: t('common.navigation.listings'),
    },
    {
      href: `/user/${username}/blog`,
      text: t('common.navigation.blog'),
    },
  ];

  return (
    <ul className="mb-4 lg:m-0">
      <DetailsLink />
      {links.map((l) => (
        <li key={l.href} className="mb-2">
          <NavLink end to={l.href} className={isActive}>
            {l.text}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default ProfileNavigation;
