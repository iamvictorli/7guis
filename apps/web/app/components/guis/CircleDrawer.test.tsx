import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '~/lib/test-utils'

import CircleDrawer from './CircleDrawer'

describe('circleDrawer', () => {
  it('adding circles to circle drawer', async () => {
    const { user } = renderWithProviders(<CircleDrawer />)
    // expects both empty undo and redo
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled()
    const canvas = screen.getByTestId('Circle Drawer')
    expect(canvas.querySelectorAll('circle').length).toBe(0)

    // pressing 2 circles, expect 2 circles and undo not disabled, redo disabled
    await user.pointer({ target: canvas, coords: { x: 200, y: 50 } })
    await user.click(canvas)

    await user.pointer({ target: canvas, coords: { x: 300, y: 100 } })
    await user.click(canvas)

    expect(canvas.querySelectorAll('circle').length).toBe(2)
    expect(screen.getByRole('button', { name: /undo/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled()

    // press undo, there should be one circle, undo not disabled, and redo not disabled
    await user.click(screen.getByRole('button', { name: /undo/i }))
    expect(canvas.querySelectorAll('circle').length).toBe(1)
    expect(screen.getByRole('button', { name: /undo/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /redo/i })).toBeEnabled()

    // press undo again, no circles, undo disabled, redo not disabled
    await user.click(screen.getByRole('button', { name: /undo/i }))
    expect(canvas.querySelectorAll('circle').length).toBe(0)
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /redo/i })).toBeEnabled()
  })

  // resource: https://github.com/adevinta/spark/blob/main/packages/components/slider/src/Slider.test.tsx
  it('adjust diamter of circle', async () => {
    const { user } = renderWithProviders(<CircleDrawer />)
    // expects both empty undo and redo
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled()
    const canvas = screen.getByTestId('Circle Drawer')
    expect(canvas.querySelectorAll('circle').length).toBe(0)

    // add a circle
    await user.pointer({ target: canvas, coords: { x: 200, y: 50 } })
    await user.click(canvas)

    expect(canvas.querySelectorAll('circle').length).toBe(1)
    expect(screen.getByRole('button', { name: /undo/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled()
    const circle = canvas.querySelector('circle')
    expect(circle).toHaveAttribute('r', expect.stringMatching('20'))

    // adjust circle diameter,
    await user.click(circle!)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuenow', expect.stringMatching('20'))

    // had to use keyboard interactions to change sliders, instead of dragging slider, helps with accessibility
    // Shift + ArrowUp, increases value by a larger step, this time it is 30
    // https://www.radix-ui.com/primitives/docs/components/slider#keyboard-interactions
    await user.keyboard('{Shift>}{ArrowUp}')
    expect(slider).toHaveAttribute('aria-valuenow', expect.stringMatching('30'))
    expect(circle).toHaveAttribute('r', expect.stringMatching('30'))

    // press undo, circle to be 20, redo to be not disabled, unto not disabled
    await user.click(screen.getByRole('button', { name: /undo/i }))
    expect(circle).toHaveAttribute('r', expect.stringMatching('20'))
    expect(screen.getByRole('button', { name: /undo/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /redo/i })).toBeEnabled()

    // press redo, redo disabled undo not disabled, circle back to 30,
    await user.click(screen.getByRole('button', { name: /redo/i }))
    expect(circle).toHaveAttribute('r', expect.stringMatching('30'))
    expect(screen.getByRole('button', { name: /undo/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled()

    // press undo twice, undo disabled, redo not disabled, no more circles
    await user.dblClick(screen.getByRole('button', { name: /undo/i }))
    expect(canvas.querySelectorAll('circle').length).toBe(0)
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /redo/i })).toBeEnabled()
  })
})
