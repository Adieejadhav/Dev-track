import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFirebase } from "../Context/fireBaseContext";

function SignUpUser() {
  const firebase = useFirebase();
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const navigate = useNavigate();

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

    const skillsArray = data.primarySkills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    try {
      await firebase.register(data.email, data.password, {
        fullName: data.fullName,
        userName: data.userName,
        primarySkills: skillsArray,
        role: data.role,
        githubUrl: data.githubUrl,
        createdAt: new Date().toISOString(),
      });

      reset();
      navigate("/dashboard");
    } catch (err) {
      setFirebaseError("Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName) =>
    `w-full px-4 py-3 rounded-xl border text-sm bg-white/90 backdrop-blur-md focus:outline-none focus:ring-2 ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-300"
        : "border-gray-300 focus:ring-indigo-400"
    }`;

  const getCombinedErrorMessage = () => {
    const allErrors = Object.values(errors).map((e) => e.message);
    return allErrors.length ? allErrors[0] : null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-50 px-4 py-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl px-6 sm:px-8 py-8 sm:py-10 space-y-6"
        noValidate
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700">
          Create your DevTrack Account
        </h2>

        {firebaseError && (
          <p className="text-red-600 text-sm text-center font-medium">
            {firebaseError}
          </p>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            autoComplete="name"
            {...register("fullName", { required: "Full Name is required" })}
            className={inputClass("fullName")}
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">User Name</label>
          <input
            type="text"
            autoComplete="username"
            {...register("userName", {
              required: "User Name is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
            })}
            className={inputClass("userName")}
            placeholder="Username"
          />
        </div>

        <div className="space-y-2">
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
            className={inputClass("email")}
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            className={inputClass("password")}
            placeholder="Create password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
            })}
            className={inputClass("confirmPassword")}
            placeholder="Repeat password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Primary Skills</label>
          <input
            type="text"
            autoComplete="on"
            {...register("primarySkills", {
              required: "Primary skills required",
            })}
            className={inputClass("primarySkills")}
            placeholder="JavaScript, React, Firebase"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">GitHub Profile</label>
          <input
            type="url"
            {...register("githubUrl", {
              pattern: {
                value: /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/,
                message: "Enter a valid GitHub URL",
              },
            })}
            className={inputClass("githubUrl")}
            placeholder="https://github.com/yourname"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">Role</label>
          <div className="flex gap-4 flex-wrap">
            {["Student", "Working", "Freelancer"].map((role) => (
              <label
                key={role}
                className="text-sm flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-xl border border-indigo-200 hover:bg-indigo-100"
              >
                <input
                  type="radio"
                  value={role}
                  {...register("role", { required: "Select a role" })}
                  className="accent-indigo-600"
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register("agreeToTerms", { required: "You must agree to terms" })}
            className="accent-indigo-600"
          />
          <span>I agree to the terms and conditions</span>
        </div>

        {getCombinedErrorMessage() && (
          <p className="text-red-600 text-xs text-center font-medium">
            {getCombinedErrorMessage()}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* 👇 Added Login Redirect Link Here */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-700">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:underline font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUpUser;
