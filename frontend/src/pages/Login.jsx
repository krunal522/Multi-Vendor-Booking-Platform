import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import Logo from "../components/common/Logo";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (fieldValues = form) => {
    const newErrors = { ...errors };

    if ("email" in fieldValues) {
      const email = fieldValues.email.trim();
      if (!email) {
        newErrors.email = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email address (e.g. user@example.com)";
      } else {
        delete newErrors.email;
      }
    }

    if ("password" in fieldValues) {
      const pwd = fieldValues.password;
      if (!pwd) {
        newErrors.password = "Password is required";
      } else if (pwd.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validate({ [name]: value });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validate({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const isValid = validate(form);
    if (!isValid) return;

    try {
      const user = await login(form.email.trim(), form.password);
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "vendor") navigate("/vendor/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(prev => ({ ...prev, ...err.response.data.errors }));
      }
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: "admin@techcorp.com", password: "Admin@123" },
      vendor: { email: "vendor1@test.com", password: "Vendor@123" },
      customer: { email: "customer@test.com", password: "Customer@123" },
    };
    setForm(creds[role]);
    setErrors({});
    setTouched({});
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div style={{ marginBottom: 40 }}>
            <Logo size="lg" showTagline={true} />
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            Welcome back to <span className="hero-title-gradient">ServeBook</span>
          </h1>
          <p className="text-muted" style={{ fontSize: 16 }}>
            Sign in to manage your bookings, services, or admin dashboard.
          </p>
          <div className="auth-features">
            {[
              "🛡️ 100% Verified & Certified Professionals",
              "⚡ Instant Booking & Doorstep Delivery",
              "💳 Secure Online Payments & Invoicing",
              "⭐ 4.8+ Rated Quality Service Guarantee"
            ].map(f => (
              <div key={f} className="auth-feature">{f}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Sign In</h2>
          <p className="text-muted" style={{ marginBottom: 28 }}>Enter your credentials to access your account</p>

          {/* Demo Credentials */}
          <div className="demo-creds">
            <p className="text-sm text-muted" style={{ marginBottom: 10 }}>🎯 Instant Demo Login:</p>
            <div className="demo-btns">
              {["admin", "vendor", "customer"].map((role) => (
                <button 
                  key={role} 
                  type="button"
                  className={`demo-btn demo-btn-${role}`} 
                  onClick={() => fillDemo(role)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className={`form-group ${errors.email ? "has-error" : ""}`}>
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  className={`form-input input-has-icon ${errors.email ? "input-error" : ""}`}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="field-error-msg">
                  <FiAlertCircle size={14} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className={`form-group ${errors.password ? "has-error" : ""}`}>
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-input input-has-icon input-has-icon-right ${errors.password ? "input-error" : ""}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  className="input-icon-right" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="field-error-msg">
                  <FiAlertCircle size={14} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full btn-lg" 
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? <span className="spinner spinner-sm" /> : <>Sign In <FiArrowRight /></>}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
