    import React, { useState } from 'react';
    import { useFirebase } from '../Context/fireBaseContext';

    function SignUpUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const firebase = useFirebase();

    const handleSubmit = (e) => {
        e.preventDefault(); // ✅ Prevent page refresh
        firebase.register(email, password)
        .then(() => console.log("✅ User registered"))
        .catch((err) => console.error("❌ Registration error:", err.message));
    };

    return (
        <div className='flex justify-center items-center h-screen'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-green-50 p-6 rounded shadow-md">
            <label htmlFor="email">Email</label>
            <input
            type="text"
            id="email"
            className='bg-green-200 p-2 rounded'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoComplete='off'
            />

            <label htmlFor="password">Password</label>
            <input
            type="password"
            id="password"
            className='bg-green-200 p-2 rounded'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            autoComplete='off'
            />

            <button
            type="submit"
            className='bg-green-400 hover:bg-green-500 text-white font-semibold p-2 rounded'
            >
            Sign Up
            </button>
        </form>
        </div>
    );
    }

    export default SignUpUser;
