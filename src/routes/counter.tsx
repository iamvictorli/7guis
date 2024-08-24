import { useAppDispatch, useAppSelector } from '~/store'

import { increment, selectCount } from 'state/counterSlice'
import { Button } from 'components/button'

function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()

  return (
    <div>
      <h1 className="text-3xl font-extralight">{count}</h1>
      <Button onClick={() => dispatch(increment(1))}>Increment</Button>
    </div>
  )
}

export default Counter
