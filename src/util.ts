import { toast } from 'react-toastify';

const defaultDuration = 2000;
const defaultPosition = 'top-right';

export const notifyWarnTopRight = (message: string) => toast.warn(message, {
  position: defaultPosition,
  autoClose: defaultDuration,
});

export const notifyErrorTopRight = (message: string) => toast.error(message, {
  position: defaultPosition,
  autoClose: defaultDuration,
});

export const notifySuccessTopRight = (message: string) => toast.success(message, {
  position: defaultPosition,
  autoClose: defaultDuration,
});
