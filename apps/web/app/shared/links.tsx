import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { href } from 'react-router'

export const navLinks = [
  {
    title: 'Counter',
    to: href('/counter'),
  },
  {
    title: 'Temperature Converter',
    to: href('/temperature-converter'),
  },
  {
    title: 'Flight Booker',
    to: href('/flight-booker'),
  },
  {
    title: 'Timer',
    to: href('/timer'),
  },
  {
    title: 'CRUD',
    to: href('/crud'),
  },
  {
    title: 'Circle Drawer',
    to: href('/circle-drawer'),
  },
  {
    title: 'Cells',
    to: href('/cells'),
  },
]

export const routes = [
  {
    label: 'GUIs',
    pages: [
      {
        title: 'Counter',
        slug: href('/counter'),
      },
      {
        title: 'Temperature Converter',
        slug: href('/temperature-converter'),
      },
      { title: 'Flight Booker', slug: href('/flight-booker') },
      { title: 'Timer', slug: href('/timer') },
      { title: 'CRUD', slug: href('/crud') },
      { title: 'Circle Drawer', slug: href('/circle-drawer') },
      { title: 'Cells', slug: href('/cells') },
    ],
  },
  {
    label: 'Source Code',
    pages: [
      {
        title: 'GitHub',
        slug: 'https://github.com/iamvictorli/7guis',
        icon: <GitHubLogoIcon />,
      },
    ],
  },
]
