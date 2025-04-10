import { Slot } from 'expo-router'
import { Provider } from 'react-redux'

import { store } from '@victorli/7guis-state/store'

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  )
}
