import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { selectCellMatrix, selectColumnLabels } from '@7guis/state/cellsSlice'
import { renderWithProviders } from '~/lib/test-utils'

import Cells from './Cells'

describe('cells', () => {
  // Mock pointer events and scrolling for Radix UI components
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

  it('renders the spreadsheet with correct structure', () => {
    const { store } = renderWithProviders(
      <Cells />,
    )

    // Check for grid presence
    expect(screen.getByRole('grid', { name: /spreadsheet/i })).toBeInTheDocument()

    // Check column headers (A-J)
    const columnLabels = selectColumnLabels(store.getState())
    columnLabels.forEach((label) => {
      expect(screen.getByRole('columnheader', {
        name: label,
      })).toBeInTheDocument()
    })

    const cellMatrix = selectCellMatrix(store.getState())

    for (let i = 1; i <= cellMatrix.length; i++) {
      expect(screen.getByRole('rowheader', {
        name: i.toString(),
      })).toBeInTheDocument()
    }
  })

  it('allows typing a value into a cell', async () => {
    const { user } = renderWithProviders(
      <Cells />,
    )

    // Click to focus cell
    const cell = screen.getAllByRole('textbox')[0]!
    await user.click(cell)
    await user.dblClick(cell)

    await user.keyboard('42')
    await user.keyboard('{Enter}')

    // Check value is displayed
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('allows entering a formula and displays computed value', async () => {
    const { user } = renderWithProviders(
      <Cells />,
    )

    // Enter value in first cell
    const cell1 = screen.getAllByRole('textbox')[0]!
    await user.click(cell1)
    await user.dblClick(cell1)
    await user.keyboard('10')
    await user.keyboard('{Enter}')

    // Enter value in second cell
    const cell2 = screen.getAllByRole('textbox')[1]!
    await user.click(cell2)
    await user.dblClick(cell2)
    await user.keyboard('20')
    await user.keyboard('{Enter}')

    // Enter formula that references previous cells
    const formulaCell = screen.getAllByRole('textbox')[2]!
    await user.click(formulaCell)
    await user.dblClick(formulaCell)

    // Use the cell IDs from the formula calculation system
    await user.keyboard('=A1+B1')
    await user.keyboard('{Enter}')

    // Check that formula evaluates correctly
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('shows "ERROR" for invalid formulas', async () => {
    const { user } = renderWithProviders(
      <Cells />,
    )

    // Enter invalid formula
    const cell = screen.getAllByRole('textbox')[0]!
    await user.click(cell)
    await user.dblClick(cell)
    await user.keyboard('abc') // Division by zero
    await user.keyboard('{Enter}')

    // Should show ERROR
    expect(screen.getByText('ERROR')).toBeInTheDocument()
  })

  it('updates dependent cells when referenced cell changes', async () => {
    const { user } = renderWithProviders(
      <Cells />,
    )

    // Set value in cell A1
    const cellA1 = screen.getAllByRole('textbox')[0]!
    await user.click(cellA1)
    await user.dblClick(cellA1)
    await user.keyboard('20')
    await user.keyboard('{Enter}')

    // Create a formula in cell B1 that references A1
    const cellB1 = screen.getAllByRole('textbox')[1]!
    await user.click(cellB1)
    await user.dblClick(cellB1)
    await user.keyboard('=A1*2')
    await user.keyboard('{Enter}')

    // Verify B1 shows the correct value (10)
    expect(screen.getByText('20')).toBeInTheDocument()

    // Now update A1 again
    await user.click(cellA1)
    await user.dblClick(cellA1)
    await user.keyboard('{backspace}{backspace}')
    await user.keyboard('40')
    await user.keyboard('{Enter}')

    // Verify B1 updates automatically
    expect(screen.getByText('80')).toBeInTheDocument()
  })
})
