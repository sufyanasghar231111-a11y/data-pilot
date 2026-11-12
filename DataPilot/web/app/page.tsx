import GetCurrentUser from "@/libs/auth/getCurrentUser";

export const instant = false
export default async function Home() {
  await GetCurrentUser();
  return (
    <div>
      hello
    </div>
  );
}
