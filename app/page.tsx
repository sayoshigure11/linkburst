import React from "react";
import Home from "./components/home";
import { baseUrl } from "@/lib/baseUrl";

async function HomePage() {
  const url = await baseUrl();
  const res = await fetch(`${url}/api/firebase/group`);
  const fetchedGroups = (await res.json()).data;
  return <Home fetchedGroups={fetchedGroups} />;
}

export default HomePage;
