import { baseUrl } from "@/lib/baseUrl";
import Kari from "./components/kari";
import { headers } from "next/headers";

async function KariPage() {
  const url = await baseUrl();
  const res = await fetch(`${url}/api/firebase/group`, {
    headers: {
      Cookie: (await headers()).get("cookie") ?? "",
    },
  });
  const fetched = await res.json();
  console.log("fetched", fetched);
  const fetchedGroups = fetched.data;

  return (
    <div>
      <Kari group={fetchedGroups} />
    </div>
  );
}

export default KariPage;
