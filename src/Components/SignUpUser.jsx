import React from 'react'

function SignUpUser() {
  return (
    <>
        <div className='w-full h-full flex justify-center items-center '>
            <label for="input">email</label>
            <input 
            type="text"
            className='bg-orange-300 p-0.5 mt-20 '
        />
        </div>
    </>
  )
}

export default SignUpUser