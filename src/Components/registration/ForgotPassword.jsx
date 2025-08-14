
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
 /* const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const Validate = () => {
    let newErrors = {};
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = Validate();
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      return;
    }
    setLoading(true);
    // Perform password reset API call here
    setTimeout(() => setLoading(false), 1500); // Simulated loading
  };
*/

  return (
    <div className="flex fixed left-0 min-h-screen w-full">
   //{/* left */}
      <div className="w-1/2 items-center justify-center h-full flex flex-col signup-container">
        <img
          src="/binit-logo.svg"
          alt="BinIt"
          className="relative right-1/7 bottom-1/25"
        />

        <form onSubmit={handleFormSubmit} className="max-w-1/2">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="max-w-full">Remember Old Password? <Link to="/Login">Login</Link></p>

          <div>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPassword(p => !p)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowConfirmPassword(p => !p)}>
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <Button
            type="submit"
            className="button border-0  w-full h-1/8 right-0 items-center rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Get Link"}
          </Button>
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

