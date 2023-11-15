import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import NotFound from '../pages/NotFound';
import ProfilePage from '../pages/profile/ProfilePagePlaceholder';
import ProfilePublicInfoPage from '../pages/profile/ProfilePublicInfoPage';
import ProfileSettingsPage from '../pages/profile/ProfileSettingsPage';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        index: true,
        element: <h1>Home</h1>,
      },
      {
        path: '/protected',
        element: <h1>Protected route</h1>,
      },
      {
        path: '/user/:username',
        children: [
          {
            path: '',
            element: <ProfilePublicInfoPage />,
          },
          {
            path: 'settings',
            element: <ProfileSettingsPage />,
          },
          {
            path: 'blog',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);

function Router(): JSX.Element {
  return <RouterProvider router={routes} />;
}

export default Router;
