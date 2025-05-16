"use client"

import {useCheckoutStore} from "@/store/checkoutStore"
import {Button} from "@/components/ui/button"
import {toast} from "sonner"

type StepNavigationProps = {
  step: number
  steps: string[]
  setStep: (step: number) => void
  onConfirm: () => void
  isStep1Valid?: boolean
  isStep2Valid?: boolean
}

export default function StepNavigation({
  step,
  steps,
  setStep,
  onConfirm,
  isStep1Valid,
  isStep2Valid,
}: StepNavigationProps) {
  const {user, address, paymentMethod} = useCheckoutStore()
  console.log(user)
  console.log(address)
  console.log(paymentMethod)

  const isFirst = step === 1
  const isLast = step === steps.length

  const validateStep = () => {
    if (step === 1 && isStep1Valid === false) {
      return (
        !!user.name.trim() &&
        !!user.email.trim() &&
        !!user.phone.trim() &&
        !!address.line.trim() &&
        !!address.city.trim() &&
        !!address.country.trim() &&
        !!address.zip.trim()
      )
    }

    if (step === 2 && isStep2Valid === false) {
      return paymentMethod !== null
    }

    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1)
    } else {
      toast.error("Required fields missing", {
        description: (
          <span className="text-sm text-gray-600">
            Please complete all required fields before continuing.
          </span>
        ),
      })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      {!isFirst && (
        <Button
          type="button"
          variant="outline"
          className="btn-secondary lg:w-1/2"
          onClick={() => setStep(step - 1)}
        >
          Back
        </Button>
      )}

      {!isLast ? (
        <Button
          type="button"
          className="btn-primary lg:w-1/2"
          onClick={handleNext}
          disabled={
            step === 1 && !isStep1Valid
              ? true
              : false || (step === 2 && !isStep2Valid)
              ? true
              : false
          }
        >
          Next
        </Button>
      ) : (
        <Button
          type="button"
          className="btn-primary lg:w-1/2"
          onClick={onConfirm}
        >
          Confirm Order
        </Button>
      )}
    </div>
  )
}
