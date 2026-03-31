import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";


export const useAuth = () => {

    const context = useContext(AuthContext)

    const  { user, setUser, loading, setLoading } = context

    // login...
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


    // register...
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


    // logout...
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



    // getMe on app load...
    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
    
                if (data && data.email) {
                    setUser(data);
                } else {
                    setUser(null);
                }

            } catch (err) {
                console.log("getMe error:", err);
                setUser(null);
                
            } finally {
                setLoading(false)
            }

        }

        getAndSetUser()

    }, []);



    return { user, loading, handleRegister, handleLogin, handleLogout }

    
}


