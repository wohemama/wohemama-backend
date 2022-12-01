"use client";

import * as React from "react";
import hotToast, { Toaster as HotToaster } from "react-hot-toast";
import Notification from "./notification";

export const Toaster = HotToaster;

interface ToastOpts {
  title: string;
  message: string;
}

export function toast(opts: ToastOpts) {
  const { title, message } = opts;

  return hotToast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <Notification isShow={t.visible} title={title} message={message} />
    </div>
  ));
}
