import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../store/appContext'
import { Navigate } from 'react-router-dom'


const UserProtected = () => {
    const { store, actions } = useContext(Context)

    useEffect(() => {
        actions.getUser()
    }, [])

    return (
        <>
            {
                store.token == null ?
                    <Navigate to={"/login"} /> :
                    <>
                        <h1>Welcome to private route!!</h1>
                        {store.users.map((item) => {
                            return (
                                <p>{item.email}</p>
                            )
                        })}
                    </>
            }
        </>
    )
}

export default UserProtected