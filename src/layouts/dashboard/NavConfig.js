// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'home',
    path: '/dashboard/home',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'sended',
    path: '/dashboard/sended',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'claimed',
    path: '/dashboard/claimed',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'wallet',
    path: '/dashboard/wallet',
    icon: getIcon('eva:people-fill'),
  },
];

export default navConfig;
