import React, { useState } from 'react';
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

  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFirebaseError = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      default:
        return 'Login failed. Please try again.';
    }
  };

  const onSubmit = async (data) => {
    setAuthError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await firebase.login(data.email, data.password);
      setSuccessMessage('✅ Login successful! Redirecting...');
      reset();
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      const friendlyMessage = handleFirebaseError(err.code);
      setAuthError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-8 space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">Welcome Back 👋</h2>
        <p className="text-center text-sm text-purple-600 mb-2">
          Login to continue tracking your dev journey.
        </p>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none"
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {/* Error / Success Messages */}
        {authError && <p className="text-sm text-red-600 font-medium text-center">{authError}</p>}
        {successMessage && <p className="text-sm text-green-600 font-medium text-center">{successMessage}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold mt-3 transition-all duration-200 ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
