import { useAppDispatch, useAppSelector } from '~/store'

import { increment, selectCount } from 'state/counterSlice'

function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()

  return (
    <div>
      <h1 className="text-3xl font-bold">{count}</h1>
      <button onClick={() => dispatch(increment(1))}>Increment</button>
    </div>
  )
}

export default Counter
