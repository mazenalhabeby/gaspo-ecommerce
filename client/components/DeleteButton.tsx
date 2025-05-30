"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {useState} from "react"
import type {ComponentProps} from "react"

interface DeleteButtonWithConfirmProps extends ComponentProps<typeof Button> {
  onDelete: () => void
  confirmText?: string
  message?: string
}

export function DeleteButton({
  onDelete,
  confirmText = "delete",
  message = "This action cannot be undone. Type 'delete' to confirm.",
  children = "Delete",
  ...props
}: DeleteButtonWithConfirmProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const handleConfirm = () => {
    onDelete()
    setOpen(false)
    setValue("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...props}>{children}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription className="whitespace-pre-line">
            {message}
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder={`Type "${confirmText}" to confirm`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={value !== confirmText}
            onClick={handleConfirm}
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
