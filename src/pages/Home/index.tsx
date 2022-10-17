import { Play } from 'phosphor-react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import * as zod from 'zod'

import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  Separator,
  StartCountDownButton,
  TaskInput,
  TimeInput,
} from './styles'

const newCycleValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser no minimo de 5 minutos')
    .max(60, 'O ciclo precisa ser no maximo de 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleValidationSchema>

export function Home() {
  const { register, handleSubmit, control, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  function handleCreateNewCycle(data: any) {
    console.log(data)
    reset()
  }

  const task = useWatch({ control, name: 'task' })
  const isSubmitButtonDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Desenvolvimento de aplicações" />
            <option value="Desenvolvimento de sistemas" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <TimeInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountDownButton disabled={isSubmitButtonDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountDownButton>
      </form>
    </HomeContainer>
  )
}
