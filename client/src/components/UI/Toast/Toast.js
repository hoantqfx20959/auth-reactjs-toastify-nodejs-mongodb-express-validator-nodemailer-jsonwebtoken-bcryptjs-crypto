import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const generateToast = (mess, type = 'error') => {
  toast[type](mess, {
    position: 'bottom-right',
  });
};

export const ToastContent = () => {
  return <ToastContainer />;
};
