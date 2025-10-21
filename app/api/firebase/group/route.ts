import { auth } from "@/auth";
import db from "@/firebase";
import { changeFavorite, createGroup, deleteGroup, getGroups, updateGroup } from "@/lib/databaseFunc";
import { mockGroups } from "@/lib/mock-data";
import { Group } from "@/lib/types";
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// データを全部取得
export async function GET() {
    console.log("GET")
    try {
        const session = await auth()
        console.log("session",session)
        if (!session?.user?.id) return NextResponse.json({
            message: "ログインされていません",
            status: 401,
            data:[]
        })
        // const groups = await getDocs(collection(db, "groups")).then((snapshot) =>
        //     snapshot.docs.map((doc) => {
        //         return doc.data();
        //     })
        // );

        const groups = await getGroups(session.user.id)
        console.log("groups", groups)
        return NextResponse.json({
            message: "データの取得に成功しました",
            status: 200,
            data:groups
        })

        // const groupsMock = mockGroups
        // return NextResponse.json({
        //     message: "データの取得に成功しました",
        //     status: 200,
        //     data:groupsMock
        // })

    } catch (error) {
        console.error("データの取得に失敗しました", error)
        return NextResponse.json({
            message: "データの取得に失敗しました",
            status: 500,
            data:null
        })
    }
}

// パラメータで指定されたidを持つグループを削除
export async function DELETE(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({
            message: "ログインしてください",
            status: 401
        })
        const urlKari = new URL(req.url);
        const params = Object.fromEntries(urlKari.searchParams.entries());
        const groupId = params.groupId;
        if (!groupId) return NextResponse.json({ error: "GroupIDがありません" }, { status: 400 })
        
        console.log("groupId",groupId)
        
        // await deleteDoc(doc(db, "groups", groupId))
        await deleteGroup(session.user.id, groupId)
        return NextResponse.json({
            message: "グループの削除に成功しました",
            status:200
        })
    } catch (error) {
        console.error("グループの削除に失敗しました", error)
        return NextResponse.json({
            message: "グループの削除に失敗しました",
            status: 500
        })
    }
    
}

// グループを新規作成
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({
            message: "ログインしてください",
            status:401
        })
        const { group }: { group: Group } = await req.json()
        if (!group) return NextResponse.json({
            message: "追加するグループの情報がありません",
            status:400
        })

        // await setDoc(doc(db, "groups", group.id), group)
        const newGroup = {
            ...group,
            userId:session.user.id
        }
        await createGroup(newGroup)
        return NextResponse.json({
            message: "グループの追加に成功しました",
            status:200
        })

    } catch (error) {
        console.error("データの追加に失敗しました", error)
        return NextResponse.json({
            message: "グループの追加に失敗しました",
            status: 500
        })
    }
}

// idで指定したグループの更新
export async function PUT(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({
            message: "ログインしてください",
            status:401
        })
        const { group }: { group: Group } = await req.json()
        if (!group) return NextResponse.json({
            message: "更新するグループの情報がありません",
            status:400
        })

        // const ref = doc(db, "groups", group.id)
        // await setDoc(ref, { ...group })
        const newGroup = {
            ...group,
            userId:session.user.id
        }
        await updateGroup(newGroup)
        return NextResponse.json({
            message: "グループの更新に成功しました",
            status:200
        })

    } catch (error) {
        console.error("グループの更新に失敗しました",error)
        return NextResponse.json({
            message: "グループの更新に失敗しました",
            status:500
        })
    }
}

// idで指定したグループのfavoriteを更新
export async function PATCH(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({
            message: "ログインしてください",
            status:401
        })
        const urlKari = new URL(req.url);
        const params = Object.fromEntries(urlKari.searchParams.entries());
        const groupId = params.groupId;
        const favorite = params.favorite
        if (!groupId) return NextResponse.json({ error: "GroupIDがありません" }, { status: 400 })
        if (!favorite) return NextResponse.json({ error: "Favoriteがありません" }, { status: 400 })
        console.log("groupId", groupId)
        console.log("favorite", favorite)

        // const ref = doc(db, "groups", groupId)
        // await updateDoc(ref, {
        //     "isFavorite": favorite
        // })

        await changeFavorite(session.user.id, groupId, Boolean(favorite))

        return NextResponse.json({
            message: "グループのお気に入りの更新に成功しました",
            status:200
        })

    } catch (error) {
        console.error("グループのお気に入りの更新に失敗しました", error)
        return NextResponse.json({
            message: "グループのお気に入りの更新に失敗しました",
            status:500
        })
    }
}