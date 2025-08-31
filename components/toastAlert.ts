import { toast } from "react-toastify";

interface ToastAlertProps {
  success: boolean;
  message: string;
}
export const toastAlert = (response: ToastAlertProps) => {
  if (response.success) {
    toast.success(response.message);
  } else {
    toast.error(response.message);
  }
};
