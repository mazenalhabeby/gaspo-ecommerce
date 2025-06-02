"use client"

import {useState} from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"

interface VariantFieldDialogProps {
  onAdd: (newField: string) => void
}

export default function VariantFieldDialog({onAdd}: VariantFieldDialogProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")

  const handleSubmit = () => {
    if (!input.trim()) return
    onAdd(input.trim())
    setInput("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/90"
        >
          Add Variant Field
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Variant Field</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="e.g. Color, Size"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mt-4"
        />

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
