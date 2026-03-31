import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()

  if(!session) {
    redirect("/sign-in")
  }else {
    redirect("/admin/dashboard")
  }

  return (
    <div></div>
  );
}
