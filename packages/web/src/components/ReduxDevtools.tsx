import { createDevTools } from '@redux-devtools/core'

import { InspectorMonitor } from './InspectorMonitor'

export const DevTools = createDevTools(<InspectorMonitor />)
