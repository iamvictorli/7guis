import { Slot } from '@radix-ui/react-slot'
import { Box, Portal, Theme } from '@radix-ui/themes'
import {
  MenuProvider,
  useMobileMenuContext,
} from '~/hooks/useMobileMenuContext'
import { useEffect, useState } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { useLocation } from 'react-router-dom'

export const MobileMenuProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // closes mobile menu when location changes
    setOpen(false)
  }, [location])

  useEffect(() => {
    // Match @media (--md)
    const mediaQueryList = window.matchMedia('(min-width: 1024px)')

    const handleChange = () => {
      setOpen((open) => (open ? !mediaQueryList.matches : false))
    }

    handleChange()
    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [])

  return (
    <MenuProvider open={open} setOpen={setOpen}>
      {children}
    </MenuProvider>
  )
}

// TODO: generate docs
// when the mobile menu is open, render a container with its children
// TODO: make it so similar to MobileMenu.Root, MobileMenu.Content
export const MobileMenuContent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const mobileMenu = useMobileMenuContext()

  if (!mobileMenu.open) {
    return null
  }

  return (
    <Portal>
      <Theme>
        <RemoveScroll as={Slot} allowPinchZoom enabled>
          <Box
            position="fixed"
            inset="0"
            className="z-[1] grid grid-rows-[auto_minmax(0,_1fr)] bg-white">
            {children}
          </Box>
        </RemoveScroll>
      </Theme>
    </Portal>
  )
}
