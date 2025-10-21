"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SignInButtonKari() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="p-2 rounded-2xl border bg-red-300 text-white font-semibold"
        >
          Sign out
        </button>
      ) : (
        <button
          onClick={() => signIn("github")}
          className="p-2 rounded-2xl border bg-green-300 text-white font-semibold"
        >
          Sign in
        </button>
      )}
    </div>
  );
}
