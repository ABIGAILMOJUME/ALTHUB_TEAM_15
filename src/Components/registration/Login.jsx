import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
//import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; 
import { Link } from "react-router-dom";


export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword] = useState(false);

  /*const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  
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
     /* const res = await fetch("https://jsonplaceholder.typicode.com/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      */
      const data = await res.json();
      if (res.ok) {
        setSuccess("Login successful!");
        // TODO: Save token in localStorage if backend provides it
      } else {
        setErrors({ api: data.message || "Login failed" });
      }
    } catch (error) {
      setErrors({ api: "Network error" });
    } finally {
      setLoading(false);
}
  };

  return (
    <div className="flex fixed h-screen w-full">
      {/* Left Section */}
      <div className="w-1/2 items-center justify-center h-full flex flex-col signup-container">
      <img src="/binit-logo.svg" alt="BinIt" className="mb-6 relative right-1/9 bottom-1/8"/>
        <form onSubmit={handleFormSubmit} className="max-w-1/2">
          <h1 className="text-2xl font-bold">Login</h1>
          <p>Welcome back! Please enter your details.</p>
          
          {success && <p className="text-green-500">{success}</p>}
          {errors.api && <p className="text-red-500">{errors.api}</p>}
         
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

          <div>Remember for 30 days <Link to="/forgot-password">Forgot Password</Link></div>

          {/* Submit */}
          <Button
            type="submit"
            className="button border-0  w-full h-1/8 rounded-md"
            disabled={loading}
          >
            {loading ? "logging in..." : "Log In"}
          </Button>

          {/* Google Signup */}
          <Button
            type="button"
            variant="outline"
            className=" bg-(--background) text-(--primary) w-full h-1/8 rounded-md"
          >
            <FcGoogle className="w-5 h-5" /> Login with Google
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm">
            Don’t have an account? {" "}
            <Link to="/Signup" className="text-chart-2">
             Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* Right Image Section */}
      <div
        className="w-1/2 max-h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/binit-image.jpg')",
        }}
      />
    </div>
  );
}
