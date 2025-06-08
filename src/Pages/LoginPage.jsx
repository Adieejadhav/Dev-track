import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useFirebase } from '../Context/fireBaseContext';

function LoginPage() {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await firebase.login(data.email, data.password);
      reset()
      navigate("/dashboard");
      console.log('Login successful');
      // TODO: Redirect to dashboard or homepage
    } catch (err) {
      console.error('Login failed:', err.message);
      // Optional: Set state to show this error in the UI
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 bg-white shadow-lg rounded-xl p-8 w-full max-w-md'
      >
        <h2 className='text-xl font-bold text-center mb-4'>Login to DevTrack</h2>

        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          className="input-field"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          autoComplete="current-password"
          {...register("password", { required: "Password is required" })}
          className="input-field"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
