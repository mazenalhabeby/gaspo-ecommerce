export default function StepIndicator({step}: {step: number}) {
  const steps = ["Address", "Pay", "Overview"]
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center w-full">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
              i + 1 <= step ? "bg-black" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`ml-2 font-medium ${
              i + 1 === step ? "text-black" : "text-gray-400"
            }`}
          >
            {label.toLowerCase()}
          </span>
          {i < steps.length - 1 && (
            <div className="flex-1 h-px bg-gray-300 mx-4" />
          )}
        </div>
      ))}
    </div>
  )
}
