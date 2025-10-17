import db from "@/firebase";
import { Link, LinkUpdateRequestType } from "@/lib/types";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";


// リンクの追加、編集、削除
export async function PATCH(req: NextRequest) {
    try {
        const { newLinks, groupId, reqType }: { newLinks: Link[], groupId:string, reqType:LinkUpdateRequestType } = await req.json()

        if (!groupId) return NextResponse.json({ error: "GroupIDがありません" }, { status: 400 })
        if (!newLinks) return NextResponse.json({ error: "リンクの情報がありません" }, { status: 400 })
        if (!reqType) return NextResponse.json({ error: "リクエストの種類の情報がありません" }, { status: 400 })
        console.log("groupId", groupId)
        console.log("newLink", newLinks)
        console.log("reqType", reqType)

        // reqTypeが[create]なら「追加」、[update]なら「編集」、[delete]なら「削除」
        const mes = reqType === "create" ? "追加" : reqType === "update" ? "編集" : "削除"

        const ref = doc(db, "groups", groupId)
        await updateDoc(ref, {
            "links": newLinks
        })

        return NextResponse.json({
            message: `リンクの${mes}に成功しました`,
            status:200
        })

    } catch (error) {
        console.error(`リンクの操作に失敗しました`, error)
        return NextResponse.json({
            message: "リンクの操作に失敗しました",
            status:500
        })
    }
}