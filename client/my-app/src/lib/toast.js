import { toast } from 'react-toastify'

export const toastSuccess = (message, options = {}) => toast.success(message, options)
export const toastError = (message, options = {}) => toast.error(message, options)
export const toastInfo = (message, options = {}) => toast.info(message, options)

export default {
  success: toastSuccess,
  error: toastError,
  info: toastInfo,
}