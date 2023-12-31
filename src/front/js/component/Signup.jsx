import React, { useState, useContext } from "react"
import { Context } from "../store/appContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const Signup = () => {

    const navigate = useNavigate()
    const { actions, store } = useContext(Context)
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

    const handleSubmit = async (event) => {
        event.preventDefault()
        let result = await actions.signup(user)
        console.log(result)
        if(result == 400) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email and password not valid'
            })
        } 
        if(result==200) {
            navigate("/login")
        }
    }

    return (
        <>
            <div className="container">
                <h1>Signup</h1>
                <form onSubmit={handleSubmit}>
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

                    <button type="submit" className="btn btn-primary mt-4">Signup</button>
                </form>
            </div>
        </>
    )
}

export default Signup