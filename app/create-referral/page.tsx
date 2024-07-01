"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function CreateReferral() {
  const [code, setCode] = useState<string>("");
  const [user, setUser] = useState<number>();
  const [copied, setCopied] = useState<boolean>(false);
  const router = useRouter();

  async function generateCodeAPI() {
    if (!user) {
      alert("user id is not provided");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/referral/account/${user}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "applicatio/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.log(">> ERROR CALLING API..");
        return;
      }
      const result = await response.json();
      if (result.referral_code) {
        setCode(result.referral_code);
        setTimeout(() => {
          router.push("/referrals");
          return;
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  useEffect(() => {
    const current_user = localStorage.getItem("current_user");
    if (current_user) {
      setUser(Number(current_user));
    }

    if (!code) {
      return;
    }

  }, [code]);

  async function handleCopy() {
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

  function renderCodeButton() {
    if (code) {
      return (
        <p
          className="flex w-full items-center justify-center h-[60px] 
        text-sm text-center border-2 border-gray-900 hover:bg-[#eeff00]"
          title="Click to copy"
          onClick={handleCopy}
        >
          {code}
        </p>
      );
    } else {
      return (
        <button
          onClick={generateCodeAPI}
          className="w-full h-[60px] border-2 text-2xl border-gray-900 hover:bg-[#eeff00]"
        >
          Generate
        </button>
      );
    }
  }
  return (
    <>
      <nav className="w-full h-[60px] bg-[#eeff00]"></nav>
      <main className="flex flex-col items-center w-full min-h-screen p-6">
        <span className="text-lg text-gray-900 border-b-4 border-[#eeff00] font-semibold">
          Generate a code for your friend.
        </span>
        <div className="flex flex-col w-full items-center justify-center h-[600px] border-2 border-gray-900 p-5 mt-6">
          <div className="flex flex-col space-y-5 w-full">
            {renderCodeButton()}
          </div>
          {copied && (
            <span className="ml-2 text-xs text-gray-900 mt-2">Copied!</span>
          )}
        </div>
      </main>
    </>
  );
}

export default CreateReferral;
