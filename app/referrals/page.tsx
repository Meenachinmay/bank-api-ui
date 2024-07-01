"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

type ReferralCodes = {
  id: number;
  referral_code: string;
  referred_id: number;
  is_used: boolean;
  created_at: string;
  used_at: string;
};

function Referrals() {
  const [user, setUser] = useState<number>(1);
  const [codes, setCodes] = useState<ReferralCodes[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadReferrals() {
      try {
        const response = await fetch(
          `http://localhost:4000/referral-codes?account=${user}`,
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
        console.log(result);
        setCodes(result);
      } catch (error) {
        console.log(">> ", error);
      }
    }

    loadReferrals();
  }, [user]);

  async function handleCopy(code: string, isUsed: boolean) {
    if (code) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      } catch (error) {
        console.error("Failed to copy text: ", error);
      }
    }
  }

  return (
    <>
      <nav className="w-full h-[60px] bg-[#eeff00]"></nav>
      <main className="flex w-full min-h-screen p-6">
        <div
          className="flex flex-col justify-between w-full border-2 border-gray-900 overflow-y-scroll"
          style={{
            minHeight: "800px",
            maxHeight: "800px",
          }}
        >
          <div className="flex flex-col space-y-5 w-full p-2">
            {codes.map((code, index) => {
              return (
                <>
                  <div className="" key={code.id}>
                    <div
                      className="flex w-full flex-1 items-center justify-between h-[60px] 
        text-sm text-center border-2 border-r-0 border-gray-900"
                    >
                      <div className="flex items-center justify-center w-full">
                        <span
                          key={code.id}
                          title="Click to copy"
                          onClick={() => handleCopy(code.referral_code)}
                          className="text-sx font-semibold"
                          style={{
                            background:
                              "linear-gradient(transparent 60%, #eeff00 60%)",
                          }}
                        >
                          {code.referral_code}
                        </span>
                      </div>
                      <div className={clsx( code.is_used ? "bg-green-800 animate-pulse" : "bg-red-800","w-[10px] h-[60px]")}></div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div className="flex items-center justify-center w-full h-[50px] bg-black">
            {copied ? (
              <span className="ml-2 text-md text-[#eeff00] mt-2">Copied!</span>
            ) : (
              <span className="text-white text-3xl">銀行</span>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Referrals;
