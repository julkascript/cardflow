import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '../App';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
    ],
  },
]);

function Router(): JSX.Element {
  return <RouterProvider router={routes} />;
}

export default Router;
