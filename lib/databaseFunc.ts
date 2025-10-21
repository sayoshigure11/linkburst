import db from "@/firebase"
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { Group, Link } from "./types"

export async function saveUserToDatabase({
    id,
    email,
    name,
    image
}: {
    id: string|undefined,
    email: string|null|undefined,
    name: string|null|undefined,
    image:string|null|undefined
}) {
    if(!id) return
    const userRef = doc(db, "users", id)
    
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
        await setDoc(userRef, {
            id,
            email,
            name,
            image,
            createdAt: new Date().toISOString()
        })
        console.log("✅ 新規ユーザー作成")
    } else {
        console.log("✅ 既存ユーザー")
    }
}

export async function getGroups(userId: string) {
    console.log("userId",userId)
    const groupsRef = collection(db, "groups")
    const q = query(groupsRef, where("userId", "==", userId))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => doc.data())
}

export async function deleteGroup(userId:string, groupId: string) {
    const groupRef = doc(db, "groups", groupId)
    const groupDoc = await getDoc(groupRef)

    if (!groupDoc.exists()) {
        throw new Error("Group not found")
    }

    if (groupDoc.data().userId !== userId) {
        throw new Error("Unauthorized")
    }

    await deleteDoc(groupRef)
}

export async function createGroup(group: Group & {userId:string}) {
    const groupRef = doc(db, "groups", group.id)
    await setDoc(groupRef, group)
}

export async function updateGroup(group: Group & { userId: string }) {
    const groupRef = doc(db, "groups", group.id)
    const groupDoc = await getDoc(groupRef)

    if (!groupDoc.exists()) {
        throw new Error("Group not found")
    }

    if (groupDoc.data().userId !== group.userId) {
        throw new Error("Unauthorized")
    }

    await setDoc(groupRef, { ...group })
}

export async function changeFavorite(userId: string, groupId: string, favorite:boolean) {
    const groupRef = doc(db, "groups", groupId)
    const groupDoc = await getDoc(groupRef)

    if (!groupDoc.exists()) {
        throw new Error("Group not found")
    }

    if (groupDoc.data().userId !== userId) {
        throw new Error("Unauthorized")
    }

    await updateDoc(groupRef, {
        "isFavorite": favorite
    })
}

export async function crudLink(userId:string, groupId:string, newLinks:Link[]) {
    const groupRef = doc(db, "groups", groupId)
    const groupDoc = await getDoc(groupRef)
    
    if (!groupDoc.exists()) {
        throw new Error("Group not found")
    }

    if (groupDoc.data().userId !== userId) {
        throw new Error("Unauthorized")
    }
    await updateDoc(groupRef, {
        "links": newLinks
    })

}