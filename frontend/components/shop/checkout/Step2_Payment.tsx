// components/shop/checkout/Step2_Payment.tsx
"use client"

import {useEffect} from "react"
import {useForm} from "react-hook-form"
import {useCheckoutStore} from "@/store/checkoutStore"

export default function Step2_Payment({
  setValid,
}: {
  setValid: (v: boolean) => void
}) {
  const {paymentMethod, setPaymentMethod} = useCheckoutStore()

  const {
    register,
    watch,
    formState: {errors, isValid},
  } = useForm<{paymentMethod: "card" | "paypal"}>({
    mode: "onChange",
    defaultValues: {
      paymentMethod: paymentMethod || undefined,
    },
  })

  useEffect(() => {
    setValid(isValid)
  }, [isValid, setValid])

  const selected = watch("paymentMethod")

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Payment Method</h2>

      <div className="flex flex-col gap-4">
        {["card", "paypal"].map((method) => (
          <label
            key={method}
            className={`border p-4 rounded flex items-center gap-3 cursor-pointer ${
              selected === method ? "border-primary" : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              value={method}
              {...register("paymentMethod", {
                required: true,
                onChange: (e) => setPaymentMethod(e.target.value),
              })}
              className="accent-primary"
            />
            <div>
              <p className="font-medium capitalize">{method}</p>
              <p className="text-sm text-gray-500">Pay with {method}</p>
            </div>
          </label>
        ))}

        {errors.paymentMethod && (
          <p className="text-red-500 text-sm">
            Please select a payment method.
          </p>
        )}
      </div>
    </div>
  )
}
