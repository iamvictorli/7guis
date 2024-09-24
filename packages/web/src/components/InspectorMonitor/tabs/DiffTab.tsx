import type { FunctionComponent } from 'react'
import type { Action } from 'redux'

import type { TabComponentProps } from '../ActionPreview'
import JSONDiff from './JSONDiff'

const DiffTab: FunctionComponent<
  TabComponentProps<unknown, Action<string>>
> = ({
  delta,
  base16Theme,
  invertTheme,
  labelRenderer,
  isWideLayout,
  dataTypeKey,
}) => (
  <JSONDiff
    {...{
      delta,
      base16Theme,
      invertTheme,
      labelRenderer,
      isWideLayout,
      dataTypeKey,
    }}
  />
)

export default DiffTab
