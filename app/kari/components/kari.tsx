"use client";

import SignInButton from "@/components/sign-in-button";
import { Group } from "@/lib/types";
import { useSession } from "next-auth/react";
import React from "react";

function Kari({ group }: { group: Group }) {
  const session = useSession();
  console.log("group", group);
  return (
    <div>
      <SignInButton />
      {session.data?.user?.id ? (
        <div>セッション中</div>
      ) : (
        <div>セッション切れ</div>
      )}
    </div>
  );
}

export default Kari;
