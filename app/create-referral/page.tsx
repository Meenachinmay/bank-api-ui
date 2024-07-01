"use client";

import { useEffect, useState } from "react";

function CreateReferral() {
  const [code, setCode] = useState<string>("");
  const [user, setUser] = useState<number>(1);

  async function generateCodeAPI () {
    if (!user) {
        alert("user id is not provided")
        return
    }
    try {
       const response = await fetch(`http://localhost:4000/referral/account/${user}`, {
        method: "POST",
        headers: {
            "Content-Type": "applicatio/json"
        },
        credentials: "include",
       }) 
       if (!response.ok) {
            console.log(">> ERROR CALLING API..")
            return
       }
       const result = await response.json();
       console.log(result);
       if (result.referral_code) {
            setCode(result.referral_code)
            return
       }
    } catch (error) {
        console.error(error)        
        return
    }
  }

  useEffect(() => {
    if (!code) {
        return
    }
  }, [code])

  function renderCodeButton() {
    if (code) {
      return (
        <p className="flex w-full items-center justify-center h-[60px] 
        text-md text-center border-2 border-gray-900 hover:bg-[#eeff00]">
          {code}
        </p>
      );
    } else {
      return (
        <button onClick={generateCodeAPI} className="w-full h-[60px] border-2 text-2xl border-gray-900 hover:bg-[#eeff00]">
          Generate
        </button>
      );
    }
  }
  return (
    <>
      <nav className="w-full h-[60px] bg-[#eeff00]"></nav>
      <main className="flex flex-col items-center w-full min-h-screen p-6">
        <span className="text-lg text-gray-900 border-b-4 border-[#eeff00] font-semibold">Generate a code for your friend.</span>
        <div className="flex flex-col w-full items-center justify-center h-[600px] border-2 border-gray-900 p-5 mt-6">
          <div className="flex flex-col space-y-5 w-full">
            {renderCodeButton()}
          </div>
        </div>
      </main>
    </>
  );
}

export default CreateReferral;
