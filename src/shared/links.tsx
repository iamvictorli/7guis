import { GitHubLogoIcon } from '@radix-ui/react-icons'

export const navLinks = [
  {
    title: 'Counter',
    to: '/counter',
  },
  {
    title: 'Temperature Converter',
    to: '/temperature-converter',
  },
  {
    title: 'Flight Booker',
    to: '/flight-booker',
  },
  {
    title: 'Timer',
    to: '/timer',
  },
  {
    title: 'CRUD',
    to: '/crud',
  },
  {
    title: 'Circle Drawer',
    to: '/circle-drawer',
  },
  {
    title: 'Cells',
    to: '/cells',
  },
]

export const routes = [
  {
    label: 'GUIs',
    pages: [
      {
        title: 'Counter',
        slug: '/counter',
      },
      {
        title: 'Temperature Converter',
        slug: '/temperature-converter',
      },
      { title: 'Flight Booker', slug: '/flight-booker' },
      { title: 'Timer', slug: '/timer' },
      { title: 'CRUD', slug: '/crud' },
      { title: 'Circle Drawer', slug: '/circle-drawer' },
      { title: 'Cells', slug: '/cells' },
    ],
  },
  {
    label: 'Source Code',
    pages: [
      {
        title: 'GitHub',
        slug: 'https://github.com/iamvictorli/7gui',
        icon: <GitHubLogoIcon />,
      },
    ],
  },
]
