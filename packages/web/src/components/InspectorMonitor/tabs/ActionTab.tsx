import type { FunctionComponent } from 'react'
import { JSONTree } from 'react-json-tree'
import type { Action } from 'redux'

import type { TabComponentProps } from '../ActionPreview'
import getItemString from './getItemString'
import getJsonTreeTheme from './getJsonTreeTheme'

const ActionTab: FunctionComponent<
  TabComponentProps<unknown, Action<string>>
> = ({
  action,
  base16Theme,
  invertTheme,
  labelRenderer,
  dataTypeKey,
  isWideLayout,
}) => (
  <JSONTree
    labelRenderer={labelRenderer}
    theme={getJsonTreeTheme(base16Theme)}
    data={action}
    getItemString={(type, data) =>
      getItemString(type, data, dataTypeKey, isWideLayout)
    }
    invertTheme={invertTheme}
    hideRoot
  />
)

export default ActionTab
