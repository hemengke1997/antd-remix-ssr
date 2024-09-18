import { useEffect, useState } from 'react'
import { useMemoizedFn } from 'ahooks'

export function useSteps<T extends string>(
  steps: T[],
  {
    defaultValue,
    onChange,
  }: {
    defaultValue?: T
    onChange?: (step: T) => void
  },
) {
  const [currentStep, setCurrentStep] = useState(defaultValue || steps[0])

  const next = useMemoizedFn(() => {
    const currentIndex = steps.indexOf(currentStep)
    if (steps.length && currentIndex !== -1) {
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1])
      } else {
        setCurrentStep(steps[0])
      }
    }
  })

  useEffect(() => {
    onChange?.(currentStep)
  }, [currentStep, onChange])

  return [currentStep, next] as const
}
