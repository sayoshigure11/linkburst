"use server"

import { auth, signIn, signOut } from "@/auth"

export async function actionSignin() {
    await signIn()
}

export async function actionSignout() {
    await signOut({redirectTo: "/"})

}

export async function kakunin() {
    const session = await auth();
    console.log("session", session)
}