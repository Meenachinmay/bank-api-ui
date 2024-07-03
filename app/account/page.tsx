"use client";

import { FieldError, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Server } from "http";

interface Account {
  id: number;
  owner: string;
  email: string;
  extra_interest: {Float64: number, Valid: boolean};
  extra_interest_start_date: {Time: string, Valid: boolean};
  extra_interest_durtaion: number;
  interest: number;
  balance: number;
  currency: string;
  createdAt: string;
}

function Account() {
  const router = useRouter();
  const [account, setAccount] = useState<Account>();
  const [user, setUser] = useState<number>();

  async function refreshExtraInterest() {
    try {
       const response = await fetch(
         `http://134.209.251.201:8080/referral/calculate/${user}`,
         {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
           credentials: "include",
         }
       ); 

       if (!response.ok) {
            console.log(">>> ERROR CALLING API...")
            return
       }
       const result = await response.json();
       console.log("extra intereste calculated ", result);
       setUser(result.id);
       setAccount(result);
    } catch (error) {
       console.error(error); 
    }
  }

  useEffect(() => {
    const current_user = localStorage.getItem("current_user");
    if (current_user) {
      setUser(Number(current_user));
    }
  }, []);

  useEffect(() => {
    async function fetchAccount() {
      if (!user) return;
      try {
        const response = await fetch(
          `http://134.209.251.201:8080/accounts/${user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error(">>> ERROR CALLING API");
        }

        const result = await response.json();
        setAccount(result);
      } catch (error) {
        console.log(">> ", error);
      }
    }

    fetchAccount();
  }, [user]); 

  return (
    <>
      <nav className="w-full h-[60px] bg-[#eeff00]"></nav>
      <main className="flex flex-col w-full min-h-screen p-6">
        <p className="mb-6 text-3xl font-bold">Banking</p>
        <div>
          <p className="font-bold">貯蓄</p>
          <div
            className="flex flex-col w-full h-[300px] border-2 border-gray-900 p-4"
            style={{
              boxShadow: "5px 5px 0 0",
            }}
          >
            <span className="text-3xl font-bold text-center">
               {'\u00A5'}{account?.balance}
            </span>
          </div>

          <p className="font-bold mt-5">情報</p>
          <div
            className="flex flex-col space-y-1 w-full h-[300px] border-2 border-gray-900 p-4"
            style={{
              boxShadow: "5px 5px 0 0",
            }}
          >
            <div>
              <span className="text-sm">現在利息</span>
              <div className="flex w-full h-[60px] bg-[#eeff00] border border-gray-900 p-2">
                <span className="text-2xl font-bold">{account?.interest}</span>
              </div>
            </div>
            <div>
              <span className="text-sm font-bold">お友達紹介による利息</span>
              <div className="flex w-full h-[60px] items-center justify-between bg-[#eeff00] border border-gray-900 p-2">
                <span className="text-2xl font-bold">
                  {!account?.extra_interest.Float64 ? "0" : account.extra_interest.Float64}
                </span>
                <p onClick={refreshExtraInterest} className="text-xs px-1 py-1 rounded-full bg-gray-900 text-[#eeff00]">refresh</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-bold">
                extra interest will start from
              </span>
              <div className="flex w-full h-[60px] bg-[#eeff00] border border-gray-900 p-2">
                <span className="flex text-xl font-bold items-center">
                  {!account?.extra_interest_start_date.Time ? (
                    <p
                      className="underline animate-pulse"
                      onClick={() => router.push("/create-referral")}
                    >
                      紹介しよう
                    </p>
                  ) : (
                    account.extra_interest_start_date.Time
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Account;
