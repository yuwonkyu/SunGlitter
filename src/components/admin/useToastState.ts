import { useCallback, useEffect, useState } from "react";
import type { StatusToastTone } from "./StatusToast";

type ToastState = {
  text: string;
  tone: StatusToastTone;
};

const TOAST_DURATION_MS = 2500;

const useToastState = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (text: string, tone: "success" | "error" = "success") => {
      setToast({ text, tone });
    },
    [],
  );

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, TOAST_DURATION_MS);

    return () => clearTimeout(timer);
  }, [toast]);

  return { toast, showToast };
};

export default useToastState;
