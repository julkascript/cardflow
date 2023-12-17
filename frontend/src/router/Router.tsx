import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import NotFound from '../pages/NotFound';
import ProfilePagePlaceholder from '../pages/profile/ProfilePagePlaceholder';
import ProfilePublicInfoPage from '../pages/profile/ProfilePublicInfoPage';
import ProfileSettingsPage from '../pages/profile/ProfileSettingsPage';
import Home from '../pages/Home';
import { authorizedGuard } from './authorizedGuard/authorizedGuard';
import Login from '../pages/Login';
import Register from '../pages/Register';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        index: true,
        element: <Login />,
      },
      {
        path: '/register',
        index: true,
        element: <Register />,
      },
      {
        path: '/protected',
        element: <h1>Protected route</h1>,
        loader: authorizedGuard,
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
            element: <ProfilePagePlaceholder />,
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
