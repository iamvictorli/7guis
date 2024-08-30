import { screen } from '@testing-library/react'
import { renderWithProviders } from '~/test-utils'

import Counter from './Counter'

test('Counter', async () => {
  const { user } = renderWithProviders(<Counter />)

  // initial value to be 0
  expect(screen.getByRole('heading')).toHaveTextContent('0')

  // each time button is clicked increases the value
  await user.click(screen.getByRole('button', { name: /increment/i }))
  expect(screen.getByRole('heading')).toHaveTextContent('1')

  await user.dblClick(screen.getByRole('button', { name: /increment/i }))
  expect(screen.getByRole('heading')).toHaveTextContent('3')
  await user.tripleClick(screen.getByRole('button', { name: /increment/i }))
  expect(screen.getByRole('heading')).toHaveTextContent('6')
})
