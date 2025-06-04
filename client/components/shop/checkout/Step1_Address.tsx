"use client"

import {useForm} from "react-hook-form"
import {useEffect} from "react"
import {useCheckoutStore} from "@/store/checkoutStore"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {MdErrorOutline} from "react-icons/md"

interface Props {
  setValid: (valid: boolean) => void
}

type FormValues = {
  name: string
  phone: string
  email: string
  address: string
  city: string
  zip: string
  country: string
  note?: string
}

const fields: {
  id: keyof FormValues
  label: string
  required?: boolean
  type: string
}[] = [
  {id: "name", label: "Full Name", required: true, type: "text"},
  {id: "phone", label: "Phone", required: true, type: "tel"},
  {id: "email", label: "Email", required: true, type: "email"},
  {id: "address", label: "Address", required: true, type: "text"},
  {id: "city", label: "City", required: true, type: "text"},
  {id: "zip", label: "ZIP", required: true, type: "text"},
  {id: "country", label: "Country", required: true, type: "text"},
  {id: "note", label: "Note (optional)", required: false, type: "text"},
]

export default function Step1_Address({setValid}: Props) {
  const {setUser, setAddress, user, address} = useCheckoutStore()

  const {
    register,
    getValues,

    formState: {errors, isValid},
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: address.line,
      city: address.city,
      zip: address.zip,
      country: address.country,
      note: address.note,
    },
  })

  useEffect(() => {
    setValid(isValid)
  }, [isValid, setValid])

  const handleBlur = () => {
    const values = getValues()
    setUser({
      name: values.name,
      phone: values.phone,
      email: values.email,
    })
    setAddress({
      line: values.address,
      city: values.city,
      zip: values.zip,
      country: values.country,
      note: values.note || "",
    })
  }

  return (
    <form className="space-y-6">
      <h2 className="text-xl font-bold">Delivery Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({id, label, required, type}) => (
          <div className="flex flex-col items-start gap-2" key={id}>
            <Label htmlFor={id} className=" px-2">
              {label}
            </Label>
            <Input
              id={id}
              type={type}
              placeholder={label}
              autoComplete="off"
              className={errors[id] ? "border-red-500" : ""}
              {...register(id, {
                required: required ? `${label} is required` : false,
                onBlur: handleBlur,
                ...(id === "email" && {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                }),
                ...(id === "phone" && {
                  pattern: {
                    value: /^[0-9+\-\s()]{6,20}$/,
                    message: "Invalid phone number",
                  },
                }),
              })}
            />
            {errors[id] && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <MdErrorOutline /> {errors[id]?.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </form>
  )
}
