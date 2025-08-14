import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate  } from "react-router-dom";
import { Form } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword] = useState(false);
  const [showConfirmPassword] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form fields
  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Replace with backend team’s endpoint
      const res = await fetch("https://jsonplaceholder.typicode.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Account created successfully!");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      } else {
        setErrors({ api: data.message || "Registration failed" });
      }
    } catch (error) {
      setErrors({ api: "Network error" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex fixed left-0 min-h-screen h-1/2 w-full">
      {/* Left Section */}
      <div className="w-1/2 items-center justify-center h-full flex flex-col signup-container">
        <img
          src="/binit-logo.svg"
          alt="BinIt"
          className="relative right-1/7 bottom-1/25"
        />
        <form onSubmit={handleFormSubmit} className=" max-w-1/2">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="max-w-full">
            Create an account to report waste, request pickups, join cleanups,
            and earn rewards.
          </p>
          {success && <p className="text-green-500">{success}</p>}
          {errors.api && <p className="text-red-500">{errors.api}</p>}

          {/* Name */}
          <div className="mb-auto">
            <label htmlFor="name" className="rounded-md text-sm m-5">
              Name*
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter your name"
              onChange={handleChange}
              className="w-full h-1/6 rounded-md"
            />
          </div>
          {errors.name && <p className="text-red-500">{errors.name}</p>}

          {/* Email */}
          <div className="mb-auto">
            <label htmlFor="email" className="">
              Email*
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full h-1/6 rounded-md"
            />
          </div>
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium"
            >
              Password*
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Create a password"
              onChange={handleChange}
              className="flex-1 outline-none"
            />
          </div>
          {errors.password && <p className="text-red-500">{errors.password}</p>}
          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium"
            >
              Confirm Password*
            </label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Comfirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="rounded-md"
            />
          </div>

          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="button border-0  w-full h-1/10 items-center rounded-md"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Get Started"}
          </Button>

          {/* Google Signup */}
          <Button
            type="button"
            variant="outline"
            className=" bg-(--background) text-(--primary) w-full h-1/10 rounded-md"
          >
            <FcGoogle /> Sign up with Google
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm">
            Already have an account? {" "}<Link to="/login" className="text-chart-2">
             Login
             </Link>
          </p>
        </form>
      </div>

      {/* Right image section*/}
      <div
        className="w-1/2 max-h-full bg-cover bg-center signup-image"
        style={{
          backgroundImage: "url('/binit-image.jpg')",
        }}
      />

    </div>
  );
}
