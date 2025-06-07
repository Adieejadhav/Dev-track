import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFirebase } from '../Context/fireBaseContext';

function SignUpUser() {
  const firebase = useFirebase();
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setFirebaseError("");

    if (data.password !== data.confirmPassword) {
      setFirebaseError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await firebase.register(data.email, data.password);
      console.log("User registered:", data);
      reset();
    } catch (err) {
      setFirebaseError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-8 m-15 w-full max-w-md"
        autoComplete="on"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Register</h2>

        {firebaseError && <p className="text-red-600 text-sm text-center">{firebaseError}</p>}

        <label className="text-sm font-medium">Full Name</label>
        <input
          type="text"
          autoComplete="name"
          {...register("fullName", { required: "Full Name is required" })}
          className="input-field"
        />
        {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}

        <label className="text-sm font-medium">User Name</label>
        <input
          type="text"
          autoComplete="username"
          {...register("userName", {
            required: "User Name is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
          })}
          className="input-field"
        />
        {errors.userName && <p className="text-red-500 text-xs">{errors.userName.message}</p>}

        <label className="text-sm font-medium">Email</label>
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

        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          autoComplete="new-password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          className="input-field"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

        <label className="text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
          })}
          className="input-field"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
        )}

        <label className="text-sm font-medium">Primary Skills</label>
        <input
          type="text"
          autoComplete="on"
          {...register("primarySkills", { required: "Primary skills required" })}
          className="input-field"
        />
        {errors.primarySkills && (
          <p className="text-red-500 text-xs">{errors.primarySkills.message}</p>
        )}

        <label className="text-sm font-medium">Role</label>
        <div className="flex gap-4 flex-wrap">
          {["Student", "Working", "Freelancer"].map((role) => (
            <label key={role} className="text-sm flex items-center gap-1">
              <input
                type="radio"
                value={role}
                {...register("role", { required: "Select a role" })}
              />
              {role}
            </label>
          ))}
        </div>
        {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}

        <label className="text-sm font-medium">GitHub Profile</label>
        <input
          type="url"
          autoComplete="url"
          {...register("githubUrl", {
            pattern: {
              value: /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/,
              message: "Enter a valid GitHub URL",
            },
          })}
          className="input-field"
        />
        {errors.githubUrl && <p className="text-red-500 text-xs">{errors.githubUrl.message}</p>}

        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            {...register("agreeToTerms", { required: "You must agree to terms" })}
          />
          I agree to the terms and conditions
        </label>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default SignUpUser;
