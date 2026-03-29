import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";


export const useAuth = () => {

    const context = useContext(AuthContext)

    const  { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)

        try {
            const data = await login({ email, password })
            setUser(data.user)
            console.log("Login successful", data);
        } catch(err) {
            console.log("Login failed", err)

        } finally {
            setLoading(false)
        }
    }


    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            console.log("Register successful", data);
        } catch(err) {
            console.log("Register failed", err)

        } finally {
            setLoading(false)
        }
    }



    const handleLogout = async () => {
        setLoading(true)

        try {
            const data = await logout()
            setUser(null)
            console.log("Logout successful", data);
        } catch(err) {
            console.log("Logout failed", err)

        } finally {
            setLoading(false)
        }
    }



    return { user, loading, handleRegister, handleLogin, handleLogout }

    
}






