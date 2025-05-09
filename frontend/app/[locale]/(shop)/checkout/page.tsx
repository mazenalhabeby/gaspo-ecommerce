"use client"

import {useState} from "react"
import Step1_Address from "@/components/shop/checkout/Step1_Address"
import Step2_Payment from "@/components/shop/checkout/Step2_Payment"
import Step3_Overview from "@/components/shop/checkout/Step3_Overview"
import StepIndicator from "@/components/shop/checkout/StepIndicator"
import OrderSummary from "@/components/shop/checkout/OrderSummary"
import {useCartStore} from "@/store/cartStore"

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const {items} = useCartStore()

  if (items.length === 0)
    return <p className="text-center py-40 text-gray-500">Your cart is empty</p>

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <StepIndicator step={step} />
        {step === 1 && <Step1_Address onNext={() => setStep(2)} />}
        {step === 2 && (
          <Step2_Payment onNext={() => setStep(3)} onBack={() => setStep(1)} />
        )}
        {step === 3 && <Step3_Overview onBack={() => setStep(2)} />}
      </div>
      <OrderSummary />
    </div>
  )
}
