import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '~/lib/test-utils'

import Crud from './CRUD'

describe('crud', () => {
  it('renders inputs and buttons correctly', () => {
    renderWithProviders(<Crud />)
    expect(screen.getByRole('textbox', {
      name: /search:/i,
    })).toBeInTheDocument()
    expect(screen.getByRole('listbox', {
      name: /name records:/i,
    })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /^name:/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', {
      name: /surname:/i,
    })).toBeInTheDocument()
    expect(screen.getByRole('button', {
      name: /create/i,
    })).toBeEnabled()
    expect(screen.getByRole('button', {
      name: /update/i,
    })).toBeDisabled()
    expect(screen.getByRole('button', {
      name: /delete/i,
    })).toBeDisabled()
  })

  it('creates a new record when "Create" is clicked', async () => {
    const { user } = renderWithProviders(<Crud />)

    await user.type(screen.getByRole('textbox', { name: /^name:/i }), 'John')
    await user.type(screen.getByRole('textbox', {
      name: /surname:/i,
    }), 'Doe')
    await user.click(screen.getByRole('button', { name: /create/i }))

    // Check that the new record appears in the list
    expect(
      screen.getByRole('option', {
        name: /doe, john/i,
      }),
    ).toBeInTheDocument()
  })

  it('updates a selected record when "Update" is clicked', async () => {
    const { user } = renderWithProviders(<Crud />)

    // Create initial item
    await user.type(screen.getByRole('textbox', { name: /^name:/i }), 'Jane')
    await user.type(screen.getByRole('textbox', {
      name: /surname:/i,
    }), 'Roe')
    await user.click(screen.getByRole('button', { name: /create/i }))

    await user.clear(screen.getByRole('textbox', { name: /surname:/i }))
    await user.type(screen.getByRole('textbox', { name: /surname:/i }), 'goodall')

    await user.click(screen.getByRole('button', { name: /update/i }))

    // Check list for updated name
    expect(screen.getByText(/goodall, jane/i)).toBeInTheDocument()
  })

  it('deletes a selected record when "Delete" is clicked', async () => {
    const { user } = renderWithProviders(<Crud />)

    // Create initial item
    await user.type(screen.getByRole('textbox', { name: /^name:/i }), 'Jake')
    await user.type(screen.getByRole('textbox', {
      name: /surname:/i,
    }), 'Smith')
    await user.click(screen.getByRole('button', { name: /create/i }))
    expect(screen.getByRole('option', {
      name: /smith, jake/i,
    })).toBeInTheDocument()

    // Select item and delete
    await user.click(screen.getByRole('button', { name: /delete/i }))

    // Verify item is removed
    expect(screen.queryByText(/smith, jake/)).not.toBeInTheDocument()
  })

  it('creates new records on empty input', async () => {
    const { user } = renderWithProviders(<Crud />)
    const createBtn = screen.getByRole('button', { name: /create/i })

    // Attempt creation with empty inputs
    await user.click(createBtn)

    expect(screen.getByRole('option', {
      name: /,/,
    })).toBeInTheDocument()
  })

  it('filters records based on search input', async () => {
    const { user } = renderWithProviders(<Crud />)

    // Create multiple items
    await user.type(screen.getByRole('textbox', { name: /^name:/i }), 'Alice')
    await user.type(screen.getByRole('textbox', { name: /surname:/i }), 'Green')
    await user.click(screen.getByRole('button', { name: /create/i }))

    await user.clear(screen.getByRole('textbox', { name: /^name:/i }))
    await user.type(screen.getByRole('textbox', { name: /^name:/i }), 'Bob')
    await user.type(screen.getByRole('textbox', { name: /surname:/i }), 'Brown')
    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(screen.getByRole('option', {
      name: /green, alice/i,
    })).toBeInTheDocument()
    expect(screen.getByRole('option', {
      name: /brown, bob/i,
    })).toBeInTheDocument()

    // Search for 'Alice'
    await user.type(screen.getByRole('textbox', {
      name: /search:/i,
    }), 'Alice')
    expect(screen.getByText(/green, alice/i)).toBeInTheDocument()
    expect(screen.queryByText(/brown, bob/i)).not.toBeInTheDocument()
  })

  it('clears selection when selected record no longer matches search input', async () => {
    const { user } = renderWithProviders(<Crud />)

    // Create item
    await user.type(screen.getByRole('textbox', { name: /^name:/i }), 'Carl')
    await user.type(screen.getByRole('textbox', { name: /surname:/i }), 'Johnson')
    await user.click(screen.getByRole('button', { name: /create/i }))

    // Select and search mismatch
    await user.click(screen.getByText(/johnson, carl/i))
    await user.type(screen.getByRole('textbox', {
      name: /search:/i,
    }), 'Xyz')

    // Check that selection is cleared
    expect(screen.getByRole('textbox', { name: /^name:/i })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: /surname:/i })).toHaveValue('')
  })
})
