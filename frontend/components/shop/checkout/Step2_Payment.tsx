export default function Step2_Payment({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Payment Method</h2>
      <p className="text-gray-600">Select a payment option</p>

      <div className="border rounded p-4 flex items-center gap-4">
        <input type="radio" checked readOnly />
        <span className="font-medium">Credit / Debit Card</span>
      </div>

      <div className="flex justify-between gap-4">
        <button onClick={onBack} className="btn-secondary w-full">
          Back
        </button>
        <button onClick={onNext} className="btn-primary w-full">
          Continue
        </button>
      </div>
    </div>
  )
}
