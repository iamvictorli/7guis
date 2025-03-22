import { Theme } from '@radix-ui/themes'
import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Toaster } from '~/components/Toast/Toaster'
import { renderWithProviders } from '~/lib/test-utils'

import FlightBooker from './FlightBooker'

describe('flightBooker', () => {
  // https://github.com/radix-ui/primitives/issues/1822#issuecomment-1448991720
  beforeAll(() => {
    class MockPointerEvent extends Event {
      button: number
      ctrlKey: boolean
      pointerType: string

      constructor(type: string, props: PointerEventInit) {
        super(type, props)
        this.button = props.button || 0
        this.ctrlKey = props.ctrlKey || false
        this.pointerType = props.pointerType || 'mouse'
      }
    }
    window.PointerEvent = MockPointerEvent as any
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
    window.HTMLElement.prototype.releasePointerCapture = vi.fn()
    window.HTMLElement.prototype.hasPointerCapture = vi.fn()
  })

  it('renders the component with defaults', () => {
    renderWithProviders(
      <Theme>
        <FlightBooker />
        <Toaster />
      </Theme>,
    )
    expect(screen.getByRole('combobox', {
      name: /select flight type/i,
    })).toBeInTheDocument()
  })

  it('shows correct text for One Way flights', () => {
    renderWithProviders(
      <Theme>
        <FlightBooker />
        <Toaster />
      </Theme>,
    )
    expect(screen.getByRole('group', { name: (/departure date/i) })).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: (/departure and return dates/i) })).not.toBeInTheDocument()
  })

  it('switches to Round Trip and shows correct text', async () => {
    const { user } = renderWithProviders(
      <Theme>
        <FlightBooker />
        <Toaster />
      </Theme>,
    )

    expect(screen.getByRole('group', { name: (/departure date/i) })).toBeInTheDocument()
    await user.click(screen.getByRole('combobox', {
      name: /select flight type/i,
    }))

    await user.click(screen.getByRole('option', {
      name: /round trip/i,
    }))

    expect(screen.queryByRole('group', { name: (/departure date/i) })).not.toBeInTheDocument()
    expect(screen.getByRole('group', { name: (/departure and return dates/i) })).toBeInTheDocument()
  })

  it('disables book button if flight is not bookable', () => {
    renderWithProviders(
      <Theme>
        <FlightBooker />
        <Toaster />
      </Theme>,
    )
    expect(screen.getByRole('button', { name: /book/i })).toBeDisabled()
  })

  it('enables book button when one-way flight date is selected', async () => {
    const { user } = renderWithProviders(
      <Theme>
        <FlightBooker />
        <Toaster />
      </Theme>,
    )
    await user.type(screen.getByRole('spinbutton', {
      name: /month, departure date/i,
    }), '3')
    await user.type(screen.getByRole('spinbutton', {
      name: /day, departure date/i,
    }), '13')
    await user.type(screen.getByRole('spinbutton', {
      name: /year, departure date/i,
    }), '2025')

    expect(screen.getByRole('button', { name: /book/i })).toBeEnabled()
  })

  it('keeps book button disabled if round-trip return is before departure', async () => {
    const { user } = renderWithProviders(
      <Theme>
        <FlightBooker />
        <Toaster />
      </Theme>,
    )
    // Switch to Round Trip
    await user.click(screen.getByRole('combobox', {
      name: /select flight type/i,
    }))

    await user.click(screen.getByRole('option', {
      name: /round trip/i,
    }))

    expect(screen.getByRole('group', { name: (/departure and return dates/i) })).toBeInTheDocument()

    // Fill departure and return
    await user.type(screen.getByRole('spinbutton', {
      name: /month, start date, departure and return dates/i,
    }), '6')
    await user.type(screen.getByRole('spinbutton', {
      name: /day, start date, departure and return dates/i,
    }), '15')
    await user.type(screen.getByRole('spinbutton', {
      name: /year, start date, departure and return dates/i,
    }), '2025')

    await user.type(screen.getByRole('spinbutton', {
      name: /month, end date, departure and return dates/i,
    }), '6')
    await user.type(screen.getByRole('spinbutton', {
      name: /day, end date, departure and return dates/i,
    }), '10')
    await user.type(screen.getByRole('spinbutton', {
      name: /year, end date, departure and return dates/i,
    }), '2025')

    expect(screen.getByRole('button', { name: /book/i })).toBeDisabled()

    // set valid end date
    await user.type(screen.getByRole('spinbutton', {
      name: /day, end date, departure and return dates/i,
    }), '20')
    expect(screen.getByRole('button', { name: /book/i })).toBeEnabled()
  })

  it('shows toast message when booking a one-way flight', async () => {
    const { user } = renderWithProviders(
      <Theme>
        <FlightBooker />
        <Toaster />
      </Theme>,
    )

    await user.type(screen.getByRole('spinbutton', {
      name: /month, departure date/i,
    }), '3')
    await user.type(screen.getByRole('spinbutton', {
      name: /day, departure date/i,
    }), '13')
    await user.type(screen.getByRole('spinbutton', {
      name: /year, departure date/i,
    }), '2025')

    await user.click(screen.getByRole('button', { name: /book/i }))

    expect(screen.getByText(/one-way flight booked/i)).toBeInTheDocument()
    expect(
      screen.getByText(/your one-way flight for 2025-03-13 has been successfully booked/i),
    ).toBeInTheDocument()
  })

  it('shows toast message when booking a round-trip flight', async () => {
    const { user } = renderWithProviders(
      <Theme>
        <FlightBooker />
        <Toaster />
      </Theme>,
    )

    // Switch to Round Trip
    await user.click(screen.getByRole('combobox', {
      name: /select flight type/i,
    }))

    await user.click(screen.getByRole('option', {
      name: /round trip/i,
    }))

    expect(screen.getByRole('group', { name: (/departure and return dates/i) })).toBeInTheDocument()

    // Fill departure and return
    await user.type(screen.getByRole('spinbutton', {
      name: /month, start date, departure and return dates/i,
    }), '6')
    await user.type(screen.getByRole('spinbutton', {
      name: /day, start date, departure and return dates/i,
    }), '15')
    await user.type(screen.getByRole('spinbutton', {
      name: /year, start date, departure and return dates/i,
    }), '2025')

    await user.type(screen.getByRole('spinbutton', {
      name: /month, end date, departure and return dates/i,
    }), '6')
    await user.type(screen.getByRole('spinbutton', {
      name: /day, end date, departure and return dates/i,
    }), '25')
    await user.type(screen.getByRole('spinbutton', {
      name: /year, end date, departure and return dates/i,
    }), '2025')

    // Book
    await user.click(screen.getByRole('button', { name: /Book/i }))
    expect(screen.getByText(/round-trip flight booked/i)).toBeInTheDocument()
    expect(
      screen.getByText(/your round-trip flight has been successfully booked. departure on 2025-06-15, returning on 2025-06-25/i),
    ).toBeInTheDocument()
  })
})
