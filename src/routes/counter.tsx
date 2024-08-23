import { increment, selectCount } from '../state/counterSlice'
import { useAppDispatch, useAppSelector } from '../store'

function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()

  return (
    <div>
      <h1 className="text-3xl font-bold">{count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
    </div>
  )
}

export default Counter
