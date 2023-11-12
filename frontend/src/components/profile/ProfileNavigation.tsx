import { NavLink } from 'react-router-dom';

type ProfileLinks = {
  href: string;
  text: string;
};

function ProfileNavigation(): JSX.Element {
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
        <li key={l.href}>
          <NavLink end to={l.href} className={({ isActive }) => (isActive ? 'font-bold' : '')}>
            {l.text}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default ProfileNavigation;
