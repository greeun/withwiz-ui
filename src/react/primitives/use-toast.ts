/**
 * use-toast
 *
 * use-toast Component
 * - shadcn/ui 기반 UI 컴포넌트
 */
"use client";

import { toast as sonnerToast } from "sonner";
import type { ReactNode } from "react";

export type ToastProps = {
  title?: string;
  description?: string | ReactNode;
  variant?: "default" | "destructive" | "success";
  duration?: number;
};

export function useToast() {
  const toast = (props: ToastProps) => {
    const { title, description, variant = "default", duration } = props;

    // sonner는 첫 번째 인자로 메시지를 받고, 두 번째 인자로 옵션(description 포함)을 받음
    // title이 메인 메시지, description이 부가 설명
    const message = title || (typeof description === 'string' ? description : "") || "";
    const options: { description?: string | ReactNode; duration?: number } = {};

    if (title && description) {
      // title과 description이 모두 있는 경우: title을 메시지로, description을 옵션으로
      options.description = description;
    }

    if (duration !== undefined) {
      options.duration = duration;
    }

    const toastOptions = Object.keys(options).length > 0 ? options : undefined;

    switch (variant) {
      case "destructive":
        sonnerToast.error(message, toastOptions);
        break;
      case "success":
        sonnerToast.success(message, toastOptions);
        break;
      default:
        sonnerToast(message, toastOptions);
        break;
    }
  };

  return { toast };
}

