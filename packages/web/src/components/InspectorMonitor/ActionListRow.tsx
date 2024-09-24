import { useTheme, type Interpolation, type Theme } from '@emotion/react'
import dateformat from 'dateformat'
import type { DebouncedFunc } from 'lodash'
import debounce from 'lodash.debounce'
import type { MouseEvent, MouseEventHandler } from 'react'
import { useState } from 'react'
import type { Action } from 'redux'

import RightSlider from './RightSlider'
import {
  selectorButtonCss,
  selectorButtonSelectedCss,
  selectorButtonSmallCss,
} from './utils/selectorButtonStyles'

const BUTTON_SKIP = 'Skip'
const BUTTON_JUMP = 'Jump'

type Button = typeof BUTTON_SKIP | typeof BUTTON_JUMP

const actionListItemTimeCss: Interpolation<Theme> = (theme) => ({
  display: 'inline',
  padding: '4px 6px',
  borderRadius: '3px',
  fontSize: '0.8em',
  lineHeight: '1em',
  flexShrink: 0,

  backgroundColor: theme.ACTION_TIME_BACK_COLOR,
  color: theme.ACTION_TIME_COLOR,
})

interface Props<A extends Action<string>> {
  actionId: number
  isInitAction: boolean
  isSelected: boolean
  isInFuture: boolean
  onSelect: MouseEventHandler<HTMLDivElement>
  timestamps: { current: number; previous: number }
  action: A
  onToggleClick: () => void
  onJumpClick: () => void
  onCommitClick: () => void
  hideActionButtons: boolean | undefined
  isSkipped: boolean
}

export default function ActionListRow<A extends Action<string>>({
  isSelected,
  action,
  actionId,
  isInitAction,
  onSelect,
  timestamps,
  isSkipped,
  isInFuture,
  hideActionButtons,
  onToggleClick,
  onJumpClick,
}: Props<A>) {
  const [hover, setHover] = useState(false)
  const theme = useTheme()

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (hover) return
    handleMouseLeave.cancel()
    handleMouseEnterDebounced(e.buttons)
  }

  const handleMouseEnterDebounced: DebouncedFunc<(buttons: number) => void> =
    debounce((buttons) => {
      if (buttons) return
      setHover(true)
    }, 150)

  const handleMouseLeave: DebouncedFunc<() => void> = debounce(() => {
    handleMouseEnterDebounced.cancel()
    if (hover) setHover(false)
  }, 100)

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.isselectorbutton) return
    handleMouseLeave()
  }

  const handleButtonClick = (btn: Button, e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    switch (btn) {
      case BUTTON_SKIP:
        onToggleClick()
        break
      case BUTTON_JUMP:
        onJumpClick()
        break
    }
  }

  const timeDelta = timestamps.current - timestamps.previous
  const showButtons = (hover && !isInitAction) || isSkipped

  const isButtonSelected = (btn: Button) => btn === BUTTON_SKIP && isSkipped

  let actionType = action.type
  if (typeof actionType === 'undefined') actionType = '<UNDEFINED>'
  else if (actionType === null) actionType = '<NULL>'
  else actionType = actionType.toString() || '<EMPTY>'

  return (
    <div
      onClick={onSelect}
      onMouseEnter={
        (!hideActionButtons &&
          handleMouseEnter) as MouseEventHandler<HTMLDivElement>
      }
      onMouseLeave={
        (!hideActionButtons &&
          handleMouseLeave) as MouseEventHandler<HTMLDivElement>
      }
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseEnter}
      data-id={actionId}
      style={{
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px 10px',
        cursor: 'pointer',
        userSelect: 'none',

        borderBottomColor: theme.BORDER_COLOR,
        ...(isSelected && {
          backgroundColor: theme.SELECTED_BACKGROUND_COLOR,
        }),
        ...(isSkipped && {
          backgroundColor: theme.SKIPPED_BACKGROUND_COLOR,
        }),
        ...(isInFuture && { opacity: '0.6' }),
      }}>
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '20px',
          ...(isSkipped && { textDecoration: 'line-through', opacity: 0.3 }),
        }}>
        {actionType}
      </div>
      {hideActionButtons ? (
        <RightSlider shown>
          <div style={{ ...actionListItemTimeCss(theme) }}>
            {timeDelta === 0
              ? '+00:00:00'
              : dateformat(
                  timeDelta,
                  timestamps.previous ? '+MM:ss.L' : 'h:MM:ss.L',
                )}
          </div>
        </RightSlider>
      ) : (
        <div style={{ position: 'relative', height: '20px', display: 'flex' }}>
          <RightSlider shown={!showButtons} rotate>
            <div style={{ ...actionListItemTimeCss(theme) }}>
              {timeDelta === 0
                ? '+00:00:00'
                : dateformat(
                    timeDelta,
                    timestamps.previous ? '+MM:ss.L' : 'h:MM:ss.L',
                  )}
            </div>
          </RightSlider>
          <RightSlider shown={showButtons} rotate>
            <div style={{ display: 'inline-flex' }}>
              {([BUTTON_JUMP, BUTTON_SKIP] as const).map(
                (btn) =>
                  (!isInitAction || btn !== BUTTON_SKIP) && (
                    <div
                      key={btn}
                      onClick={(e) => handleButtonClick(btn, e)}
                      style={{
                        ...selectorButtonCss(theme),
                        ...(isButtonSelected(btn) && {
                          ...selectorButtonSelectedCss(theme),
                          selectorButtonSmallCss,
                        }),
                      }}
                      data-isselectorbutton={true}>
                      {btn}
                    </div>
                  ),
              )}
            </div>
          </RightSlider>
        </div>
      )}
    </div>
  )
}
