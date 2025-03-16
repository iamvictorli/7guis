import { Box, Flex, Heading, Text } from '@radix-ui/themes'
import React from 'react'
import { NavLink } from 'react-router'

import { cn } from '~/lib/utils'

interface NavProps {
  routes: {
    label?: string
    pages: {
      title: string
      slug: string
      icon?: React.ReactNode
    }[]
  }[]
}

function isExternalLink(link: string) {
  return link.startsWith('http')
}

export default function Nav({ routes }: NavProps) {
  return (
    <nav>
      {routes.map((section, sectionIndex) => (
        <Box key={section.label ?? sectionIndex} mb="4">
          {section.label && (
            <Box py="2" px="3">
              <Heading as="h4" size={{ initial: '3', md: '2' }}>
                {section.label}
              </Heading>
            </Box>
          )}

          {section.pages.map((page, pageIndex) => (
            // TODO: scroll into view active links
            // https://github.com/radix-ui/website/blob/a01a0ff156ea80be39d34b20e3214b3dae6c96bc/components/DocsNav.tsx#L76-L99
            // TODO: own class?
            <NavLink
              key={page.slug}
              to={page.slug}
              className={({ isActive }) => {
                return cn(
                  'flex min-h-8 select-none items-center rounded-[var(--radius-thumb)] px-3 py-2 text-[var(--gray-12)] no-underline [transition:background-color_50ms_linear] hover:bg-[var(--accent-a4)] focus:outline-hidden focus-visible:[box-shadow:inset_0_0_0_1px_var(--accent-8),_0_0_0_1px_var(--accent-8)]',
                  isActive
                    ? 'bg-[var(--accent-a5)] hover:bg-[var(--accent-a5)]'
                    : '',
                  // emulates not last of type link css. :not(:last-of-type)
                  sectionIndex === routes.length - 1
                  && pageIndex === section.pages.length - 1
                    ? ''
                    : 'mb-px',
                )
              }}
              target={isExternalLink(page.slug) ? '_blank' : undefined}
              rel={isExternalLink(page.slug) ? 'noreferral' : undefined}
            >
              <Flex gap="2" align="center">
                {page.icon}
                <Text size={{ initial: '3', sm: '2' }}>{page.title}</Text>
              </Flex>
            </NavLink>
          ))}
        </Box>
      ))}
    </nav>
  )
}
