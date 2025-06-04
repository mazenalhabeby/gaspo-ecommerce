type StepIndicatorProps = {
  steps: string[]
  step: number
  onStepClick?: (step: number) => void
}

export default function StepIndicator({
  step,
  onStepClick,
  steps,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const stepIndex = i + 1
        const isActive = stepIndex === step
        const isCompleted = stepIndex < step
        const isClickable = isCompleted

        return (
          <div key={label} className="flex items-center w-full">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick?.(stepIndex)}
              className="flex flex-col md:flex-row items-center justify-center min-w-20 group focus:outline-none disabled:cursor-not-allowed"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all
                  ${
                    isActive
                      ? "bg-black text-white"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }
                `}
              >
                {stepIndex}
              </div>
              <span
                className={`ml-1 md:ml-2 text-sm font-medium ${
                  isActive
                    ? "text-black"
                    : isCompleted
                    ? "text-gray-800"
                    : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </button>

            {i < steps.length - 1 && (
              <div className="flex-1 h-px bg-gray-300 mx-1 md:mx-4" />
            )}
          </div>
        )
      })}
    </div>
  )
}
