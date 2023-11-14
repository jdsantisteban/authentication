import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../store/appContext'
import { Navigate } from 'react-router-dom'
import { Link } from "react-router-dom";


const Private = () => {
    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.getUser()
    }, [])

    return (
        <div className='container'>
            {
                store.token == null ?
                    <Navigate to={"/login"} /> :
                    <>
                        <h1>Welcome to the private route!!</h1>
                        <h2>Registered users</h2>
                        <ul>
                                {store.users.map((item) => {
                                    return (
                                        <li>{item.email}</li>
                                    )
                                })}
                        </ul>
                    </>
            }
            {
						<Link to="/login">
							<button className="btn btn-danger">Logout</button>
						</Link>

					}
        </div>
    )
}

export default Private