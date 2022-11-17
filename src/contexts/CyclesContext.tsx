import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {
  addNewCycleAction,
  markCurrentCycleasFinishedAction,
  interruptCycleAction,
} from '../reducers/cycles/action'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCylceId: string | null
  amountSecondsPassed: number
  markCurrentCycleasFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  handleFinishCycle: () => void
}

interface CycleContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCylceId: null,
    },
    () => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer: cycles-state-1.0.0',
      )
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return {
        cycles: [],
        activeCylceId: null,
      }
    },
  )

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-timer: cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  const { cycles, activeCylceId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCylceId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  function markCurrentCycleasFinished() {
    dispatch(markCurrentCycleasFinishedAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function handleFinishCycle() {
    document.title = 'Ignite Timer'
    dispatch(interruptCycleAction())
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCylceId,
        markCurrentCycleasFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        handleFinishCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
