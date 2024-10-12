import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { Provider } from 'react-redux'

import { increment, selectCount } from '@7gui/state/counterSlice'
import { Button } from 'app/components/Button'

import { store, useAppDispatch, useAppSelector } from './store'

function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()
  return (
    <>
      <Text>{count}</Text>
      <Button text="Increment" onClick={() => dispatch(increment(1))} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Counter />
        <StatusBar style="auto" />
      </View>
    </Provider>
  )
}
