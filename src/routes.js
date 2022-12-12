import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import AddProduct from './pages/addProduct';
import DetailOrder from './pages/detailOrder';
import UpdProduct from './pages/updateProduct';
import UpdateWareHose from './pages/UpdateWareHose';
import Territory from './pages/Territory';
import Regions from './pages/Regions';
import AddWarehouse from './pages/AddWarehouse';
import StaffInfo from './pages/StaffInfo';
import ShopManagement from './pages/ShopManagement';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'shopOrdersManagement', element: <User /> },
        { path: 'resultReport', element: <Products /> },
        { path: 'order', element: <Blog /> },
        // { path: 'login', element: <Login /> },
        { path: 'addProduct', element: <AddProduct /> },
        { path: 'register', element: <Register /> },
        { path: 'updateProduct/', element: <UpdProduct /> },
        { path: 'orderDetail/', element: <DetailOrder /> },
        { path: 'orderHistory/', element: <DetailOrder /> },
        { path: 'updateWareHose/', element: <UpdateWareHose /> },
        { path: 'territory/', element: <Territory /> },
        { path: 'regions/', element: <Regions /> },
        { path: 'addWarehouse/', element: <AddWarehouse /> },
        { path: 'staffInfo/', element: <StaffInfo /> },
        { path: 'shopManagement/', element: <ShopManagement /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/shopManagement" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        // { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
