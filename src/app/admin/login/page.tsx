"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import api from "@/lib/axios";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

const login = async () => {

  try {


    const res = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );


    if(res.data.success){

      router.push("/admin/dashboard");

    }


  } catch(err:any){

    setError(
      err.response?.data?.message ||
      "Login failed"
    );

  }

};

  return (
    <div
      className="
min-h-screen
flex
items-center
justify-center
bg-gray-100
"
    >
      <div
        className="
bg-white
p-8
rounded-xl
shadow
w-96
"
      >
        <h1
          className="
text-2xl
font-bold
mb-6
"
        >
          Admin Login
        </h1>

        <input
          className="
border
w-full
p-3
mb-3
rounded
"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="
border
w-full
p-3
mb-3
rounded
"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <button
          onClick={login}
          className="
bg-black
text-white
w-full
p-3
rounded
"
        >
          Login
        </button>
      </div>
    </div>
  );
}
