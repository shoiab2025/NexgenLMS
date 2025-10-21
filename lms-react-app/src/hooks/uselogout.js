import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthcontext } from '../contexts/Authcontext'

const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const {setAuthUser} = useAuthcontext()

  const logout = async () => {
    setLoading(true)
    try {

        const res = await fetch('/api/users/sign_out', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json()
        if(data.error) {
            console.log(res)
            throw new Error(data)
        }

        localStorage.removeItem('lms-user')
        setAuthUser(null)
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }finally {
        setLoading(false)
    }
  }

  return { logout, loading }
}

export default useLogout