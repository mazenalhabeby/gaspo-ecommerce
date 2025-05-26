import {toast} from "sonner"
import {FaCircleCheck, FaCircleInfo, FaCircleXmark} from "react-icons/fa6"

type ToastType = "success" | "error" | "info"

interface ToastOptions {
  message: string
  type?: ToastType
  description?: string
}

export function useAppToast() {
  return ({message, type = "info", description}: ToastOptions) => {
    const sharedStyle = {
      color: "#fff",
      borderRadius: "6px",
    }

    const styleMap = {
      success: {
        backgroundColor: "#5eb861",
        icon: <FaCircleCheck className="text-2xl pr-0.5" />,
        className: "bg-green-500",
      },
      error: {
        backgroundColor: "#f35a4f",
        icon: <FaCircleXmark className="text-2xl pr-0.5" />,
      },
      info: {
        backgroundColor: "#2196f3",
        icon: <FaCircleInfo className="text-2xl pr-0.5" />,
      },
    }

    const toastStyle = styleMap[type]

    toast(message, {
      description,
      icon: toastStyle.icon,
      style: {
        backgroundColor: toastStyle.backgroundColor,
        ...sharedStyle,
      },
    })
  }
}
