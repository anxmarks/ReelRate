"use client";

import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  const handClick = () => {
    router.push("/login");
    };

  return (
    <button
      onClick={handClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
        LogIn
    </button>
  );
}
