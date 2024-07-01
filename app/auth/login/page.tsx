"use client";

import { FieldError, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Server } from "http";

type LoginProps = {
  email: string;
};

type ServerErrors = {
  error: string;
};

function Login() {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<ServerErrors[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();

  const onSubmit = async (data: LoginProps) => {
    try {
      const response = await fetch("http://localhost:4000/accounts/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(">>> ERROR CALLING API");
      }
      const result = await response.json();
      if (result && result !== "email does not exist") {
        if (localStorage.getItem("current_user")) {
            localStorage.removeItem("current_user");
        }
        localStorage.setItem("current_user", result.id)
        router.push("/create-referral")
      }

    } catch (error) {
      console.log(">> ", error);
    }
  };

  return (
    <>
      <nav className="w-full h-[60px] bg-[#eeff00]"></nav>
      <main className="flex w-full min-h-screen p-6 items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 justify-between w-full h-[600px] border-2 border-gray-900"
        >
          <div className="flex flex-col space-y-5 w-full p-5">
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

            <button className="w-full h-[60px] border-2 border-gray-900 hover:bg-[#eeff00]">
              ログイン
            </button>
            {
                serverErrors && serverErrors.map((error, index) => (
                    <p key={index}>{error.error}</p>
                ))
            }
          </div>
          <div className="flex items-center justify-center w-full h-[50px] bg-black">
            <span className="text-white text-3xl">銀行</span>
          </div>
        </form>
      </main>
    </>
  );
}

export default Login;
