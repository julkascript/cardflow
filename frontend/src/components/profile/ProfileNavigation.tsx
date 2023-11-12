import { NavLink } from 'react-router-dom';

type ProfileLinks = {
  href: string;
  text: string;
};

function ProfileNavigation(): JSX.Element {
  function isActive({ isActive }: { isActive: boolean }) {
    return isActive ? 'font-bold hover:underline' : 'hover:underline';
  }

  const links: ProfileLinks[] = [
    /*
      TO-DOs:
        - generate hrefs dynamically
        - hide account details link from other users
    */
    {
      href: '/profile/TheAverageTCGEnjoyer/settings',
      text: 'Account details',
    },
    {
      href: '/profile/TheAverageTCGEnjoyer',
      text: 'Public info',
    },
    {
      href: '/profile/TheAverageTCGEnjoyer/blog',
      text: 'Blog',
    },
  ];

  return (
    <ul className="mb-4 lg:m-0">
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
