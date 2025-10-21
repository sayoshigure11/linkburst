// "use client";
// import { useSession } from "next-auth/react";
// import { actionSigninKari, actionSignoutKari } from "./action";
// export default function SignInButtonKari() {
//   const { data } = useSession();

//   return (
//     <div>
//       {data ? (
//         <form action={actionSignoutKari}>
//           <button
//             className="p-2 rounded-2xl border bg-red-300 text-white font-semibold"
//             type="submit"
//           >
//             Sign out
//           </button>
//         </form>
//       ) : (
//         <form action={actionSigninKari}>
//           <button
//             type="submit"
//             className="p-2 rounded-2xl border bg-green-300 text-white font-semibold"
//           >
//             Sign in
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }

"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SignInButtonKari() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <button
          onClick={() => signOut({ callbackUrl: "/kari2" })}
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
