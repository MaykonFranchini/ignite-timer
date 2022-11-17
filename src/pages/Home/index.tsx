import { Play, HandPalm } from 'phosphor-react'
import {
  StartCountDownButton,
  StopCountDownButton,
  HomeContainer,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useContext } from 'react'
import { CyclesContext } from '../../contexts/CyclesContext'

const newCycleValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser no minimo de 5 minutos')
    .max(60, 'O ciclo precisa ser no maximo de 60 minutos'),
})

export type NewCycleFormData = zod.infer<typeof newCycleValidationSchema>

export function Home() {
  const { handleFinishCycle, createNewCycle, activeCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, control, reset } = newCycleForm

  const task = useWatch({ control, name: 'task' })
  const isSubmitButtonDisabled = !task

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountDownButton onClick={handleFinishCycle} type="submit">
            <HandPalm size={24} />
            Encerrrar
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitButtonDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
