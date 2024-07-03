"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { notosansjp } from "@/fonts";

import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

type AuthProps = {
  email: string;
  owner: string;
  currency: string;
  referral_code?: string;
};

function Auth() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthProps>();

  const onSubmit = async (data: AuthProps) => {
    data.currency = "YEN";
    const loaderID = toast.loading("読み込み中");
    try {
      const response = await fetch(`https://mahitech.org/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.dismiss(loaderID);
        toast.error("アカウント作成エラー");
        return;
      }

      // Dismiss the loading toast and show a success toast
      toast.dismiss(loaderID);
      const result = await response.json();
      toast.success("口座開設できたました。", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="w-full h-[60px] bg-[#eeff00]"></nav>
      <main
        className={clsx(
          notosansjp.className,
          "flex w-full min-h-screen p-6 items-center justify-center"
        )}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 justify-between w-full h-[600px] border-2 border-gray-900"
        >
          <div className="flex flex-col space-y-5 w-full p-5">
            {errors.owner && (
              <p className="text-red-700 text-xs bg-red-300 rounded-sm w-8 text-center py-1 font-bold">
                {errors.owner.message}
              </p>
            )}
            <input
              className="w-full h-[60px] border-2 border-t-0 border-l-0 border-r-0 border-gray-900 px-3 focus:outline-none"
              placeholder="お名前"
              {...register("owner", { required: "必須" })}
            />

            {errors.email && (
              <p className="text-red-700 text-xs bg-red-300 rounded-sm w-8 text-center py-1 font-bold">
                {errors.email.message}
              </p>
            )}
            <input
              className="w-full h-[60px] border-2 border-t-0 border-l-0 border-r-0 border-gray-900 px-3 focus:outline-none"
              placeholder="メール"
              {...register("email", {
                required: "必須",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
            />
            <input
              className="w-full h-[60px] border-2 border-t-0 border-l-0 border-r-0 border-gray-900 px-3 focus:outline-none"
              placeholder="コード入力"
              {...register("referral_code", {})}
            />

            <button className="w-full h-[60px] border-2 border-gray-900 hover:bg-[#eeff00]">
              口座開設
            </button>
            <span
              className="hover:text-blue-500 underline"
              onClick={() => router.push("/auth/login")}
            >
              ログイン
            </span>
          </div>
          <div className="flex items-center justify-center w-full h-[50px] bg-black">
            <span className="text-white text-3xl">銀行</span>
          </div>
        </form>
      </main>
    </>
  );
}

export default Auth;
