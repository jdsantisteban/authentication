import React, { useState, useContext } from "react"
import { Context } from "../store/appContext"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const navigate = useNavigate()
    const { actions } = useContext(Context)

    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const handleChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        })
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        let result = await actions.login(user)
        console.log(result)
        if(result == 400) {
            alert("Bad credentials")
        }
        if(result == 200) {
            navigate("/private")
        }
    }

    return (
        <>
            <div className="container">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            />
                    </div>
                    <div className="form-group mt-4">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">Login</button>
                </form>
            </div>
        </>
    )
}

export default Login