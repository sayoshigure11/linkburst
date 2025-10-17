import db from "@/firebase";
import { mockGroups } from "@/lib/mock-data";
import { Group } from "@/lib/types";
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// データを全部取得
export async function GET() {
    try {
        const groups = await getDocs(collection(db, "groups")).then((snapshot) =>
            snapshot.docs.map((doc) => {
                return doc.data();
            })
        );
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
        const urlKari = new URL(req.url);
        const params = Object.fromEntries(urlKari.searchParams.entries());
        const groupId = params.groupId;
        if (!groupId) return NextResponse.json({ error: "GroupIDがありません" }, { status: 400 })
        
        console.log("groupId",groupId)
        
        await deleteDoc(doc(db, "groups", groupId))
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
        const { group }: { group: Group } = await req.json()
        if (!group) return NextResponse.json({
            message: "追加するグループの情報がありません",
            status:400
        })

        await setDoc(doc(db, "groups", group.id), group)
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
        const { group }: { group: Group } = await req.json()
        if (!group) return NextResponse.json({
            message: "更新するグループの情報がありません",
            status:400
        })

        const ref = doc(db, "groups", group.id)
        await setDoc(ref, { ...group })
        
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
        const urlKari = new URL(req.url);
        const params = Object.fromEntries(urlKari.searchParams.entries());
        const groupId = params.groupId;
        const favorite = params.favorite
        if (!groupId) return NextResponse.json({ error: "GroupIDがありません" }, { status: 400 })
        if (!favorite) return NextResponse.json({ error: "Favoriteがありません" }, { status: 400 })
        console.log("groupId", groupId)
        console.log("favorite", favorite)

        const ref = doc(db, "groups", groupId)
        await updateDoc(ref, {
            "isFavorite": favorite
        })

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