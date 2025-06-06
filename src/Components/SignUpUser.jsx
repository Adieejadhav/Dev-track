import React from 'react'
import { useState } from 'react'

function SignUpUser() {
    const [email ,setEmail]= useState("");
    const [password,setPassword]= useState("")




  return (
    <>
        <div className='flex justify-center items-center h-screen gap-9'>


            <label for="input">email</label>
            <input 
            type="text"
            className='bg-green-200 p-2 rounded'
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            />

            <label for="input">password</label>
            <input 
            type="password"
            className='bg-green-200 p-2 rounded '
            onChange={(e)=>setPassword()}
            />

            <button 
                className='bg-green-200 p-2 rounded border-2'
                onClick={()=>handleSumit}
            >
                submit
            </button>

        </div>
        
    </>
  )
}

export default SignUpUser