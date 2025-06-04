"use client"

import React, {useState} from "react"
import Step1_Address from "@/components/shop/checkout/Step1_Address"
import Step2_Payment from "@/components/shop/checkout/Step2_Payment"
import Step3_Overview from "@/components/shop/checkout/Step3_Overview"
import StepIndicator from "@/components/shop/checkout/StepIndicator"
import OrderSummary from "@/components/shop/checkout/OrderSummary"
import {useCartStore} from "@/store/cartStore"
import StepNavigation from "@/components/StepNavigation"
export default function CheckoutClientPage() {
  const steps = ["Address", "Pay", "Overview"]
  const [step, setStep] = useState(1)
  const [isStep1Valid, setStep1Valid] = useState(false)
  const [isStep2Valid, setStep2Valid] = useState(false)
  const {items} = useCartStore()

  const onConfirm = () => {
    alert("Order confirmed!")
  }

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[calc(100vh_-_210px)] lg:px-16">
      {items.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <div className="lg:col-span-2">
            <StepIndicator step={step} steps={steps} />
            {step === 1 && <Step1_Address setValid={setStep1Valid} />}
            {step === 2 && <Step2_Payment setValid={setStep2Valid} />}
            {step === 3 && <Step3_Overview />}
          </div>

          <div className="border rounded p-6 space-y-6 lg:sticky top-28 h-max lg:col-span-1">
            <OrderSummary />
            <StepNavigation
              step={step}
              steps={steps}
              setStep={setStep}
              onConfirm={onConfirm}
              isStep1Valid={isStep1Valid}
              isStep2Valid={isStep2Valid}
            />
          </div>
        </>
      )}
    </div>
  )
}
