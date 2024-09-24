import { useTheme } from '@emotion/react'
import type { Interpolation, Theme } from '@emotion/react'
import { stringify } from 'javascript-stringify'
import type { Delta } from 'jsondiffpatch'
import type { Base16Theme } from 'react-base16-styling'
import { JSONTree } from 'react-json-tree'
import type { LabelRenderer, ShouldExpandNodeInitially } from 'react-json-tree'

import getItemString from './getItemString'
import getJsonTreeTheme from './getJsonTreeTheme'

function stringifyAndShrink(val: unknown, isWideLayout?: boolean) {
  if (val === null) {
    return 'null'
  }

  const str = stringify(val)
  if (typeof str === 'undefined') {
    return 'undefined'
  }

  if (isWideLayout)
    return str.length > 42 ? str.substr(0, 30) + '…' + str.substr(-10) : str
  return str.length > 22 ? `${str.substr(0, 15)}…${str.substr(-5)}` : str
}

const expandFirstLevel: ShouldExpandNodeInitially = (_keyName, _data, level) =>
  level <= 1

function prepareDelta(value: any) {
  if (value && value._t === 'a') {
    const res: { [key: string]: any } = {}
    for (const key in value) {
      if (key !== '_t') {
        if (key[0] === '_' && !value[key.substring(1)]) {
          res[key.substring(1)] = value[key]
        } else if (value['_' + key]) {
          res[key] = [value['_' + key][0], value[key][0]]
        } else if (!value['_' + key] && key[0] !== '_') {
          res[key] = value[key]
        }
      }
    }
    return res
  }

  return value
}

const diffCss: Interpolation<Theme> = (theme) => ({
  padding: '2px 3px',
  borderRadius: '3px',
  position: 'relative',

  color: theme.TEXT_COLOR,
})

const diffWrapCss = { position: 'relative', zIndex: 1 }

interface Props {
  delta: Delta | null | undefined | false
  base16Theme: Base16Theme
  invertTheme: boolean
  labelRenderer: LabelRenderer
  isWideLayout: boolean
  dataTypeKey: string | symbol | undefined
}

export default function JSONDiff({ delta, base16Theme, ...props }: Props) {
  const theme = useTheme()
  const valueRenderer = (raw: any, value: any) => {
    const { isWideLayout } = props

    if (Array.isArray(value)) {
      switch (value.length) {
        case 1:
          return (
            <span style={{ ...diffWrapCss }}>
              <span
                key="diffAdd"
                style={{
                  ...diffCss,
                  backgroundColor: theme.DIFF_ADD_COLOR,
                }}>
                {stringifyAndShrink(value[0], isWideLayout)}
              </span>
            </span>
          )
        case 2:
          return (
            <span style={{ ...diffWrapCss }}>
              <span
                key="diffUpdateFrom"
                style={{
                  ...diffCss,
                  textDecoration: 'line-through',
                  backgroundColor: theme.DIFF_REMOVE_COLOR,
                }}>
                {stringifyAndShrink(value[0], isWideLayout)}
              </span>
              <span
                key="diffUpdateArrow"
                style={{ ...diffCss, color: theme.DIFF_ARROW_COLOR }}>
                {' => '}
              </span>
              <span
                key="diffUpdateTo"
                style={{
                  ...diffCss,
                  backgroundColor: theme.DIFF_ADD_COLOR,
                }}>
                {stringifyAndShrink(value[1], isWideLayout)}
              </span>
            </span>
          )
        case 3:
          return (
            <span style={{ ...diffWrapCss }}>
              <span
                key="diffRemove"
                style={{
                  ...diffCss,
                  textDecoration: 'line-through',
                  backgroundColor: theme.DIFF_REMOVE_COLOR,
                }}>
                {stringifyAndShrink(value[0])}
              </span>
            </span>
          )
      }
    }

    return raw
  }

  if (!delta) {
    return (
      <div
        style={{
          padding: '10px',
          color: theme.TEXT_PLACEHOLDER_COLOR,
        }}>
        (states are equal)
      </div>
    )
  }

  return (
    <JSONTree
      {...props}
      theme={getJsonTreeTheme(base16Theme)}
      data={delta}
      getItemString={(type: string, data: any) =>
        getItemString(type, data, props.dataTypeKey, props.isWideLayout, true)
      }
      valueRenderer={valueRenderer}
      postprocessValue={prepareDelta}
      isCustomNode={Array.isArray}
      shouldExpandNodeInitially={expandFirstLevel}
      hideRoot
    />
  )
}
