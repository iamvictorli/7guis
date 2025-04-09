import type { Preview } from '@storybook/react'
import type { IndexEntry } from '@storybook/types'

const guiStoryOrder = [
  'Counter',
  'TemperatureConverter',
  'FlightBooker',
  'Timer',
  'CRUD',
  'CircleDrawer',
  'Cells',
]

const preview: Preview = {
  parameters: {
    options: {
      storySort: (a: IndexEntry, b: IndexEntry) => {
        // Check if both stories belong to the 'GUIs' component group
        if (a.title === 'GUIs' && b.title === 'GUIs') {
          const indexA = guiStoryOrder.indexOf(a.name)
          const indexB = guiStoryOrder.indexOf(b.name)

          // If a story name isn't in our list, put it at the end
          const finalIndexA = indexA === -1 ? guiStoryOrder.length : indexA
          const finalIndexB = indexB === -1 ? guiStoryOrder.length : indexB

          return finalIndexA - finalIndexB // Compare positions in the desired order
        }

        return 0
      },
    },
  },
  decorators: [],
}

export default preview
