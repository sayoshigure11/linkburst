import { headers } from "next/headers"

export const baseUrl = async () => {
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"

    return `${protocol}://${host}`
}