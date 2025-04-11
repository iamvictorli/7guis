import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { selectCount } from '@victorli/7guis-state/counterSlice'
import { renderWithProviders } from '~/lib/test-utils'

import Counter from './Counter'

describe('counter', () => {
  it('renders initial count from store (default 0)', () => {
    renderWithProviders(<Counter />)
    expect(screen.getByText(/0/)).toBeInTheDocument()
  })

  it('increments the counter when the button is clicked', async () => {
    const { user } = renderWithProviders(<Counter />)
    const incrementButton = screen.getByRole('button', { name: /increment/i })
    await user.click(incrementButton)
    expect(screen.getByText(/1/)).toBeInTheDocument()
  })

  it('supports a negative initial state', () => {
    renderWithProviders(<Counter />, {
      preloadedState: {
        counter: { count: -5 },
      },
    })
    expect(screen.getByText(/-5/)).toBeInTheDocument()
  })

  it('increments from a large initial state', async () => {
    const { user } = renderWithProviders(<Counter />, {
      preloadedState: {
        counter: { count: 9999 },
      },
    })
    expect(screen.getByText(/9999/)).toBeInTheDocument()
    const incrementButton = screen.getByRole('button', { name: /increment/i })
    await user.click(incrementButton)
    expect(screen.getByText(/10000/)).toBeInTheDocument()
  })

  it('dispatches correct action payload on button click', async () => {
    const { store, user } = renderWithProviders(<Counter />)
    const incrementButton = screen.getByRole('button', { name: /increment/i })
    await user.click(incrementButton)
    const state = store.getState()
    expect(selectCount(state)).toBe(1)
  })
})
