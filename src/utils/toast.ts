import React from 'react';
import { Toast } from 'primereact/toast';

let toastRef: React.RefObject<Toast> | null = null;

export const setToastRef = (ref: React.RefObject<Toast>) => {
  toastRef = ref;
};

export const showToast = {
  success: (message: string, summary: string = 'Sucesso') => {
    if (toastRef?.current) {
      toastRef.current.show({
        severity: 'success',
        summary,
        detail: message,
        life: 4000,
      });
    }
  },

  error: (message: string, summary: string = 'Erro') => {
    if (toastRef?.current) {
      toastRef.current.show({
        severity: 'error',
        summary,
        detail: message,
        life: 5000,
      });
    }
  },

  warn: (message: string, summary: string = 'Atenção') => {
    if (toastRef?.current) {
      toastRef.current.show({
        severity: 'warn',
        summary,
        detail: message,
        life: 4000,
      });
    }
  },

  info: (message: string, summary: string = 'Informação') => {
    if (toastRef?.current) {
      toastRef.current.show({
        severity: 'info',
        summary,
        detail: message,
        life: 4000,
      });
    }
  },
};

