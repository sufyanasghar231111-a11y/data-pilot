import LoginPageComponent from "@/components/loginpage/loginpagecomponent"
import GetCurrentUser from "@/libs/auth/getCurrentUser"
export const instant = false
export default async function Login() {

    await GetCurrentUser()

    return <LoginPageComponent />
}