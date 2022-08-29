// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
  {
    title: 'Quản Lý Danh Sách Đơn Hàng',
    path: '/dashboard/user',
   // icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Thống Kê Kho',
    path: '/dashboard/products',
   // icon: getIcon('eva:shopping-bag-fill'),
  },
  // {
  //   title: 'Order',
  //   path: '/dashboard/order',
  //  icon: getIcon('eva:alert-triangle-fill'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  {
    title: 'logout',
    path: '/logout',
   // icon: getIcon('eva:lock-fill'),
  },
  // {
  //   title: 'register',
  //   path: '/dashboard/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
