import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiBriefcase, FiAlertCircle } from "react-icons/fi";
import Logo from "../components/common/Logo";

const CATEGORIES = ["Salon", "Home Cleaning", "Plumbing", "Electrical", "AC Repair", "Pest Control", "Painting", "Carpentry", "Appliance Repair", "Beauty & Spa"];

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "customer",
    businessName: "", businessCategory: "", businessDescription: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    if (pwd.length < 6) return { score: 1, label: "Weak (min 6 chars)", color: "strength-weak" };
    let score = 1;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
    if (score === 2) return { score: 2, label: "Fair", color: "strength-fair" };
    return { score: 3, label: "Strong", color: "strength-strong" };
  };

  const strength = getPasswordStrength(form.password);

  const validate = (fieldValues = form) => {
    const newErrors = { ...errors };

    if ("name" in fieldValues) {
      const name = fieldValues.name?.trim();
      if (!name) newErrors.name = "Full name is required";
      else if (name.length < 2) newErrors.name = "Name must be at least 2 characters";
      else delete newErrors.name;
    }

    if ("email" in fieldValues) {
      const email = fieldValues.email?.trim();
      if (!email) newErrors.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email address";
      } else delete newErrors.email;
    }

    if ("password" in fieldValues) {
      const pwd = fieldValues.password;
      if (!pwd) newErrors.password = "Password is required";
      else if (pwd.length < 6) newErrors.password = "Password must be at least 6 characters long";
      else delete newErrors.password;
    }

    if (form.role === "vendor") {
      if ("businessName" in fieldValues) {
        const bName = fieldValues.businessName?.trim();
        if (!bName) newErrors.businessName = "Business name is required for service providers";
        else if (bName.length < 2) newErrors.businessName = "Business name must be at least 2 characters";
        else delete newErrors.businessName;
      }

      if ("businessCategory" in fieldValues) {
        if (!fieldValues.businessCategory) {
          newErrors.businessCategory = "Please select your primary service category";
        } else delete newErrors.businessCategory;
      }
    } else {
      delete newErrors.businessName;
      delete newErrors.businessCategory;
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
    setTouched({
      name: true,
      email: true,
      password: true,
      businessName: form.role === "vendor",
      businessCategory: form.role === "vendor"
    });

    const isValid = validate(form);
    if (!isValid) return;

    try {
      const payload = { 
        name: form.name.trim(), 
        email: form.email.trim(), 
        password: form.password, 
        role: form.role 
      };
      if (form.role === "vendor") {
        payload.businessName = form.businessName.trim();
        payload.businessCategory = form.businessCategory;
        payload.businessDescription = form.businessDescription.trim();
      }
      const user = await register(payload);
      if (user.role === "vendor") navigate("/vendor/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(prev => ({ ...prev, ...err.response.data.errors }));
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div style={{ marginBottom: 40 }}>
            <Logo size="lg" showTagline={true} />
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            Join <span className="hero-title-gradient">ServeBook</span> Today
          </h1>
          <p className="text-muted" style={{ fontSize: 16 }}>
            Create your account and start booking trusted doorstep services or grow your business.
          </p>
          <div className="auth-features">
            {[
              "⭐ Top-Rated Doorstep Home & Personal Care",
              "🛡️ Verified Background-Checked Experts",
              "💳 100% Secure Payments & Transparent Pricing",
              "🕒 Flexible Slot Scheduling with 24/7 Support"
            ].map(f => (
              <div key={f} className="auth-feature">{f}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card" style={{ maxWidth: 500 }}>
          <h2 className="auth-title">Create Account</h2>
          <p className="text-muted" style={{ marginBottom: 20 }}>Choose your role and enter your details to get started</p>
          
          {/* Role Toggle */}
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${form.role === "customer" ? "role-btn-active" : ""}`}
              onClick={() => {
                setForm({ ...form, role: "customer" });
                setErrors({});
              }}
            >
              <FiUser /> Customer
            </button>
            <button
              type="button"
              className={`role-btn ${form.role === "vendor" ? "role-btn-active" : ""}`}
              onClick={() => {
                setForm({ ...form, role: "vendor" });
                setErrors({});
              }}
            >
              <FiBriefcase /> Service Provider
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className={`form-group ${errors.name ? "has-error" : ""}`}>
              <label className="form-label" htmlFor="register-name">Full Name *</label>
              <div className="input-with-icon">
                <FiUser className="input-icon" />
                <input 
                  id="register-name"
                  name="name"
                  type="text" 
                  className={`form-input input-has-icon ${errors.name ? "input-error" : ""}`} 
                  placeholder="e.g. Rahul Sharma"
                  value={form.name} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <div className="field-error-msg">
                  <FiAlertCircle size={14} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className={`form-group ${errors.email ? "has-error" : ""}`}>
              <label className="form-label" htmlFor="register-email">Email Address *</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input 
                  id="register-email"
                  name="email"
                  type="email" 
                  className={`form-input input-has-icon ${errors.email ? "input-error" : ""}`} 
                  placeholder="you@example.com"
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

            {/* Password */}
            <div className={`form-group ${errors.password ? "has-error" : ""}`}>
              <label className="form-label" htmlFor="register-password">Password (min 6 chars) *</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input 
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  className={`form-input input-has-icon input-has-icon-right ${errors.password ? "input-error" : ""}`} 
                  placeholder="Create a strong password"
                  value={form.password} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
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

              {/* Password Strength Meter */}
              {form.password && (
                <div className="password-strength-wrap">
                  <div className="password-strength-bars">
                    <div className={`strength-bar ${strength.score >= 1 ? strength.color : ""}`} />
                    <div className={`strength-bar ${strength.score >= 2 ? strength.color : ""}`} />
                    <div className={`strength-bar ${strength.score >= 3 ? strength.color : ""}`} />
                  </div>
                  <div className="strength-text text-muted" style={{ fontSize: 11 }}>
                    Strength: <span style={{ color: strength.score === 3 ? "#10b981" : strength.score === 2 ? "#f59e0b" : "#ef4444" }}>{strength.label}</span>
                  </div>
                </div>
              )}

              {errors.password && (
                <div className="field-error-msg">
                  <FiAlertCircle size={14} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Vendor Specific Fields */}
            {form.role === "vendor" && (
              <>
                <div className={`form-group ${errors.businessName ? "has-error" : ""}`}>
                  <label className="form-label">Business / Agency Name *</label>
                  <input 
                    name="businessName"
                    type="text" 
                    className={`form-input ${errors.businessName ? "input-error" : ""}`} 
                    placeholder="e.g. Apex Home Care Solutions"
                    value={form.businessName} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.businessName && (
                    <div className="field-error-msg">
                      <FiAlertCircle size={14} />
                      <span>{errors.businessName}</span>
                    </div>
                  )}
                </div>

                <div className={`form-group ${errors.businessCategory ? "has-error" : ""}`}>
                  <label className="form-label">Primary Service Category *</label>
                  <select 
                    name="businessCategory"
                    className={`form-select ${errors.businessCategory ? "input-error" : ""}`} 
                    value={form.businessCategory} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.businessCategory && (
                    <div className="field-error-msg">
                      <FiAlertCircle size={14} />
                      <span>{errors.businessCategory}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Business Description</label>
                  <textarea 
                    name="businessDescription"
                    className="form-textarea" 
                    placeholder="Briefly describe your experience, team size, tools, or certifications..." 
                    rows={3}
                    value={form.businessDescription} 
                    onChange={handleChange} 
                  />
                  <div className="field-helper">Tell customers why they should trust your services.</div>
                </div>

                <div className="info-box">
                  🛡️ Vendor accounts receive an instant verification review by admin before listings go public.
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full btn-lg" 
              disabled={loading} 
              style={{ marginTop: 12 }}
            >
              {loading ? <span className="spinner spinner-sm" /> : <>Create Account <FiArrowRight /></>}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
