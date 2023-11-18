import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';

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
        path: '/signup',
        index: true,
        element: <Register />,
      },
      {
        path: '/login',
        index: true,
        element: <Login />,
      },
      {
        path: '/protected',
        element: <h1>Protected route</h1>,
      },
    ],
  },
]);

function Router(): JSX.Element {
  return <RouterProvider router={routes} />;
}

export default Router;
