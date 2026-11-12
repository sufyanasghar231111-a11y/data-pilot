import RegisterPageComponent from "@/components/registerpage/registerpagecomponent"
import GetCurrentUser from "@/libs/auth/getCurrentUser"
export const instant = false

export default async function Register() {
    await GetCurrentUser()
    return <RegisterPageComponent />
}