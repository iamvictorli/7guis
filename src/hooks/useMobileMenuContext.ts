import { createContext } from '@radix-ui/react-context'

export const [MenuProvider, useMenuContext] = createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>('MobileMenu')

export const useMobileMenuContext = () => useMenuContext('MobileMenu')
