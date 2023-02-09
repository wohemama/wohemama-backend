import client from "../../../utils/prismaClient";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../utils/session";
import Tabs from "./tabs";

export default async function Profile() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const profile = await client.profile.findUnique({
    where: { userEmail: user!.email! },
  });
  return (
    <Tabs
      user={{ name: user.name!, email: user.email! }}
      website={profile && profile.website || ''}
      host={process.env.NEXTAUTH_URL!}
    />
  );
}
