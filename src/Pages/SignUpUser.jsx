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

    // Convert skills to array, trimming each one
    const skillsArray = data.primarySkills
      .split(",")
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0); // remove empty entries

    try {
      await firebase.register(data.email, data.password, {
        fullName: data.fullName,
        userName: data.userName,
        primarySkills: skillsArray,  // Upload array to Firestore
        role: data.role,
        githubUrl: data.githubUrl,
        createdAt: new Date().toISOString(),
      });

      console.log("User registered:", {
        ...data,
        primarySkills: skillsArray,
      });

      reset();
      navigate("/dashboard");

    } catch (err) {
      setFirebaseError(err.message);
    } finally {
      setLoading(false);
    }
};


  const inputClass = (fieldName) =>
    `input-field ${errors[fieldName] ? "border-red-500" : "border-gray-300"}`;

  // Combine all error messages into a single string
  const getCombinedErrorMessage = () => {
    // Get all error messages in the formState.errors object
    const allErrors = Object.values(errors).map((error) => error.message);
    if (allErrors.length === 0) return null;
    // Return the first error message or you can join all with commas or line breaks
    return allErrors[0];
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-white shadow-lg rounded-xl p-8 m-15 w-full max-w-md"
        autoComplete="on"
        noValidate
      >
        <h2 className="text-2xl font-bold text-center mb-2">Register to DevTrack</h2>

        {/* General Firebase error at top */}
        {firebaseError && (
          <p className="text-red-600 text-sm text-center">{firebaseError}</p>
        )}

        {/* Your inputs with dynamic red border on error */}
        <label className="text-sm font-medium">Full Name</label>
        <input
          type="text"
          autoComplete="name"
          placeholder="Enter your Fullname"
          {...register("fullName", { required: "Full Name is required" })}
          className={inputClass("fullName")}
        />

        <label className="text-sm font-medium">User Name</label>
        <input
          type="text"
          autoComplete="username"
          placeholder="Enter Username for the profile"
          {...register("userName", {
            required: "User Name is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
          })}
          className={inputClass("userName")}
        />

        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          autoComplete="email"
          placeholder="Enter your Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          className={inputClass("email")}
        />

        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          className={inputClass("password")}
        />

        <label className="text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
          })}
          className={inputClass("confirmPassword")}
        />

        <label className="text-sm font-medium">Primary Skills</label>
        <input
          type="text"
          autoComplete="on"
          placeholder="Enter your Skills Seperated by the ,"
          {...register("primarySkills", { required: "Primary skills required" })}
          className={inputClass("primarySkills")}
        />

        <label className="text-sm font-medium">GitHub Profile</label>
        <input
          type="url"
          autoComplete="url"
          placeholder="GitHub Url"
          {...register("githubUrl", {
            pattern: {
              value: /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/,
              message: "Enter a valid GitHub URL",
            },
          })}
          className={inputClass("githubUrl")}
        />

        <div className="bg-white border border-gray-300 rounded-md p-4 shadow-sm mb-4">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Role</label>

          <div className="flex gap-4 flex-wrap">
            {["Student", "Working", "Freelancer"].map((role) => (
              <label
                key={role}
                className="text-sm flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                <input
                  type="radio"
                  value={role}
                  {...register("role", { required: "Select a role" })}
                  className="accent-blue-500"
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            {...register("agreeToTerms", { required: "You must agree to terms" })}
          />
          I agree to the terms and conditions
        </label>

        {/* Show combined error message at the bottom */}
        {getCombinedErrorMessage() && (
          <p className="text-red-600 text-sm font-semibold text-center mt-2">
            {getCombinedErrorMessage()}
          </p>
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
