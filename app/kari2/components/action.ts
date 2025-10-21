"use server"

import { auth, signIn, signOut } from "@/auth"

export async function actionSigninKari() {
    await signIn()
}

export async function actionSignoutKari() {
    await signOut({redirectTo: "/kari2"})
}
