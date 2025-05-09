import {useState} from "react"

export default function Step1_Address({onNext}: {onNext: () => void}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Delivery Details</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="input"
        value={form.name}
        onChange={(e) => setForm({...form, name: e.target.value})}
      />
      <input
        type="text"
        placeholder="Phone"
        className="input"
        value={form.phone}
        onChange={(e) => setForm({...form, phone: e.target.value})}
      />
      <input
        type="email"
        placeholder="Email"
        className="input"
        value={form.email}
        onChange={(e) => setForm({...form, email: e.target.value})}
      />
      <input
        type="text"
        placeholder="Shipping Address"
        className="input"
        value={form.address}
        onChange={(e) => setForm({...form, address: e.target.value})}
      />

      <button onClick={onNext} className="btn-primary w-full">
        Continue
      </button>
    </div>
  )
}
