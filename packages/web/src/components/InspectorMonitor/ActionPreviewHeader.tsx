import { useTheme } from '@emotion/react'
import type { Interpolation, Theme } from '@emotion/react'
import type { Action } from 'redux'

import type { Tab } from './ActionPreview'
import {
  selectorButtonCss,
  selectorButtonSelectedCss,
} from './utils/selectorButtonStyles'

const inspectedPathKeyCss = {
  '&:not(:last-child):after': {
    content: '" > "',
  },
}

const inspectedPathKeyLinkCss: Interpolation<Theme> = (theme) => ({
  cursor: 'pointer',
  color: theme.LINK_COLOR,
  '&:hover': {
    textDecoration: 'underline',
    color: theme.LINK_HOVER_COLOR,
  },
})

interface Props<S, A extends Action<string>> {
  tabs: Tab<S, A>[]
  inspectedPath: (string | number)[]
  onInspectPath: (path: (string | number)[]) => void
  tabName: string
  onSelectTab: (tabName: string) => void
}

function ActionPreviewHeader({
  inspectedPath,
  onInspectPath,
  tabName,
  onSelectTab,
  tabs,
}: Props<unknown, Action<string>>) {
  const theme = useTheme()
  return (
    <div
      key="previewHeader"
      style={{
        flex: '0 0 30px',
        padding: '5px 10px',
        alignItems: 'center',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',

        backgroundColor: theme.HEADER_BACKGROUND_COLOR,
        borderBottomColor: theme.HEADER_BORDER_COLOR,
      }}>
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          float: 'right',
        }}>
        {tabs.map((tab) => (
          <div
            onClick={() => onSelectTab(tab.name)}
            key={tab.name}
            style={{
              ...selectorButtonCss(theme),
              ...(tab.name === tabName && selectorButtonSelectedCss(theme)),
            }}>
            {tab.name}
          </div>
        ))}
      </div>
      <div style={{ padding: '6px 0' }}>
        {inspectedPath.length ? (
          <span style={{ ...inspectedPathKeyCss }}>
            <a
              onClick={() => onInspectPath([])}
              style={{ ...inspectedPathKeyLinkCss }}>
              {tabName}
            </a>
          </span>
        ) : (
          tabName
        )}
        {inspectedPath.map((key, idx) =>
          idx === inspectedPath.length - 1 ? (
            <span key={key}>{key}</span>
          ) : (
            <span key={key} style={{ ...inspectedPathKeyCss }}>
              <a
                onClick={() => onInspectPath(inspectedPath.slice(0, idx + 1))}
                style={{ ...inspectedPathKeyLinkCss }}>
                {key}
              </a>
            </span>
          ),
        )}
      </div>
    </div>
  )
}

export default ActionPreviewHeader
