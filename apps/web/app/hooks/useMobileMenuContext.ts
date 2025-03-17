import type React from 'react'

import { createContext } from '@radix-ui/react-context'

const [MenuProvider, useMenuContext] = createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>('MobileMenu')

const useMobileMenuContext = () => useMenuContext('MobileMenu')

export { MenuProvider, useMobileMenuContext }
