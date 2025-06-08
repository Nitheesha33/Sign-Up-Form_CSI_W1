import React, { useState, useMemo, useCallback } from "react";
import "./App.css";
import { countryData } from "./countryData";

const initialState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  phoneCountry: countryData[0].dial_code,
  phoneNumber: "",
  country: countryData[0].name,
  city: "",
  pan: "",
  aadhar: "",
};

function validate(name, value, values) {
  switch (name) {
    case "firstName":
    case "lastName":
      if (!value) return `${name === "firstName" ? "First" : "Last"} name is required`;
      if (!/^[A-Za-z]{2,}$/.test(value)) return "Enter at least 2 letters";
      return "";
    case "username":
      if (!value) return "Username is required";
      if (!/^[A-Za-z0-9_]{4,}$/.test(value)) return "Min 4 chars, letters/numbers/_";
      return "";
    case "email":
      if (!value) return "Email is required";
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return "Invalid email";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Min 6 characters";
      if (!/[A-Z]/.test(value)) return "At least 1 uppercase letter";
      if (!/[a-z]/.test(value)) return "At least 1 lowercase letter";
      if (!/[0-9]/.test(value)) return "At least 1 number";
      return "";
    case "phoneNumber":
      if (!value) return "Phone number is required";
      if (!/^\d{7,15}$/.test(value)) return "Enter 7-15 digits";
      return "";
    case "city":
      if (!value) return "City is required";
      if (!countryData.find(c => c.name === values.country).cities.includes(value))
        return "Select a valid city";
      return "";
    case "pan":
      if (!value) return "PAN is required";
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) return "Invalid PAN format";
      return "";
    case "aadhar":
      if (!value) return "Aadhar is required";
      if (!/^\d{12}$/.test(value)) return "Aadhar must be 12 digits";
      return "";
    default:
      return "";
  }
}

function getProgress(values) {
  const fields = [
    "firstName", "lastName", "username", "email", "password",
    "phoneNumber", "country", "city", "pan", "aadhar"
  ];
  let valid = 0;
  for (let key of fields) {
    if (values[key] && !validate(key, values[key], values)) valid++;
  }
  return Math.round((valid / fields.length) * 100);
}

function App() {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const selectedCountry = useMemo(
    () => countryData.find(c => c.name === values.country) || countryData[0],
    [values.country]
  );
  const filteredCities = useMemo(
    () =>
      selectedCountry.cities.filter(city =>
        city.toLowerCase().includes((values.city || "").toLowerCase())
      ),
    [selectedCountry, values.city]
  );
  const progress = useMemo(() => getProgress(values), [values]);

  const handleInput = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => {
      if (name === "country") {
        const country = countryData.find(c => c.name === value);
        return {
          ...prev,
          country: country.name,
          phoneCountry: country.dial_code,
          city: "",
        };
      }
      return { ...prev, [name]: value };
    });
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validate(name, value, { ...values, [name]: value })
    }));
  }, [values]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validate(name, value, values)
    }));
  }, [values]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(initialState).forEach((key) => {
      if (key === "phoneCountry" || key === "country") return;
      newErrors[key] = validate(key, values[key], values);
    });
    setErrors(newErrors);
    setTouched(Object.fromEntries(Object.keys(initialState).map(k => [k, true])));
    if (Object.values(newErrors).every((v) => !v)) {
      setShowSuccess(true);
      setSubmitted(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  }, [values]);

  const handleReset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setSubmitted(false);
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="App">
      {showSuccess && (
        <div className="success-popup">Form submitted successfully!</div>
      )}
      {!submitted ? (
        <div className="form-card">
          <button className="reset-btn top-right" type="button" onClick={handleReset}>Reset</button>
          <h2>Registration Form</h2>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <form className="single-form" onSubmit={handleSubmit} autoComplete="off">
            {/* First Name */}
            <div className="form-group">
              <label>
                First Name <span className="asterisk">*</span>
              </label>
              <input
                name="firstName"
                value={values.firstName}
                onChange={handleInput}
                onBlur={handleBlur}
                className={touched.firstName && errors.firstName ? "invalid" : touched.firstName && !errors.firstName ? "valid" : ""}
                autoComplete="off"
              />
              {touched.firstName && errors.firstName && (
                <div className="error">{errors.firstName}</div>
              )}
            </div>
            {/* Last Name */}
            <div className="form-group">
              <label>
                Last Name <span className="asterisk">*</span>
              </label>
              <input
                name="lastName"
                value={values.lastName}
                onChange={handleInput}
                onBlur={handleBlur}
                className={touched.lastName && errors.lastName ? "invalid" : touched.lastName && !errors.lastName ? "valid" : ""}
                autoComplete="off"
              />
              {touched.lastName && errors.lastName && (
                <div className="error">{errors.lastName}</div>
              )}
            </div>
            {/* Username */}
            <div className="form-group">
              <label>
                Username <span className="asterisk">*</span>
              </label>
              <input
                name="username"
                value={values.username}
                onChange={handleInput}
                onBlur={handleBlur}
                className={touched.username && errors.username ? "invalid" : touched.username && !errors.username ? "valid" : ""}
                autoComplete="off"
              />
              {touched.username && errors.username && (
                <div className="error">{errors.username}</div>
              )}
            </div>
            {/* Email */}
            <div className="form-group">
              <label>
                Email <span className="asterisk">*</span>
              </label>
              <input
                name="email"
                value={values.email}
                onChange={handleInput}
                onBlur={handleBlur}
                className={touched.email && errors.email ? "invalid" : touched.email && !errors.email ? "valid" : ""}
                autoComplete="off"
              />
              {touched.email && errors.email && (
                <div className="error">{errors.email}</div>
              )}
            </div>
            {/* Password */}
            <div className="form-group">
              <label>
                Password <span className="asterisk">*</span>
              </label>
              <div className="password-wrapper">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleInput}
                  onBlur={handleBlur}
                  className={touched.password && errors.password ? "invalid" : touched.password && !errors.password ? "valid" : ""}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((s) => !s)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {touched.password && errors.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>
            {/* Phone */}
            <div className="form-group">
              <label>
                Phone <span className="asterisk">*</span>
              </label>
              <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                <select
                  name="phoneCountry"
                  value={values.phoneCountry}
                  onChange={handleInput}
                  style={{ width: "30%" }}
                >
                  {countryData.map((c) => (
                    <option key={c.code} value={c.dial_code}>
                      {c.flag} {c.dial_code}
                    </option>
                  ))}
                </select>
                <input
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleInput}
                  onBlur={handleBlur}
                  className={touched.phoneNumber && errors.phoneNumber ? "invalid" : touched.phoneNumber && !errors.phoneNumber ? "valid" : ""}
                  style={{ width: "70%" }}
                  autoComplete="off"
                />
              </div>
              {touched.phoneNumber && errors.phoneNumber && (
                <div className="error">{errors.phoneNumber}</div>
              )}
            </div>
            {/* Country */}
            <div className="form-group">
              <label>
                Country <span className="asterisk">*</span>
              </label>
              <select
                name="country"
                value={values.country}
                onChange={handleInput}
                onBlur={handleBlur}
                className={touched.country && errors.country ? "invalid" : touched.country && !errors.country ? "valid" : ""}
              >
                {countryData.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
            {/* City with suggestions */}
            <div className="form-group" style={{ position: "relative" }}>
              <label>
                City <span className="asterisk">*</span>
              </label>
              <input
                name="city"
                value={values.city}
                onChange={handleInput}
                onBlur={handleBlur}
                onFocus={() => setShowCitySuggestions(true)}
                autoComplete="off"
                className={touched.city && errors.city ? "invalid" : touched.city && !errors.city ? "valid" : ""}
              />
              {showCitySuggestions && filteredCities.length > 0 && (
                <div className="city-suggestions">
                  {filteredCities.map((city) => (
                    <div
                      key={city}
                      className="city-suggestion"
                      onMouseDown={() => {
                        setValues((v) => ({ ...v, city }));
                        setShowCitySuggestions(false);
                        setTouched((t) => ({ ...t, city: true }));
                        setErrors((err) => ({ ...err, city: validate("city", city, { ...values, city }) }));
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
              {touched.city && errors.city && (
                <div className="error">{errors.city}</div>
              )}
            </div>
            {/* PAN */}
            <div className="form-group">
              <label>
                PAN <span className="asterisk">*</span>
              </label>
              <input
                name="pan"
                value={values.pan}
                onChange={handleInput}
                onBlur={handleBlur}
                className={touched.pan && errors.pan ? "invalid" : touched.pan && !errors.pan ? "valid" : ""}
                autoComplete="off"
                placeholder="ABCDE1234F"
              />
              {touched.pan && errors.pan && (
                <div className="error">{errors.pan}</div>
              )}
            </div>
            {/* Aadhar */}
            <div className="form-group">
              <label>
                Aadhar <span className="asterisk">*</span>
              </label>
              <input
                name="aadhar"
                value={values.aadhar}
                onChange={handleInput}
                onBlur={handleBlur}
                className={touched.aadhar && errors.aadhar ? "invalid" : touched.aadhar && !errors.aadhar ? "valid" : ""}
                autoComplete="off"
                placeholder="12 digit number"
              />
              {touched.aadhar && errors.aadhar && (
                <div className="error">{errors.aadhar}</div>
              )}
            </div>
            {/* Actions */}
            <div className="form-actions">
              <button className="submit-btn" type="submit" disabled={progress < 100}>
                Submit
              </button>
              {/* Removed the Reset button here */}
            </div>
          </form>
        </div>
      ) : (
        <div className="details-container summary-card">
          <h2>Registration Summary</h2>
          <div className="summary-row"><b>Name:</b> {values.firstName} {values.lastName}</div>
          <div className="summary-row"><b>Username:</b> {values.username}</div>
          <div className="summary-row"><b>Email:</b> {values.email}</div>
          <div className="summary-row"><b>Phone:</b> {values.phoneCountry} {values.phoneNumber}</div>
          <div className="summary-row"><b>Country:</b> {selectedCountry.flag} {values.country}</div>
          <div className="summary-row"><b>City:</b> {values.city}</div>
          <div className="summary-row"><b>PAN:</b> {values.pan}</div>
          <div className="summary-row"><b>Aadhar:</b> {values.aadhar}</div>
          <div className="summary-actions">
            <button className="reset-btn" onClick={handleReset}>Register Another</button>
          </div>
        </div>
      )}
      {/* Upward arrow button */}
      <button
        className="scroll-to-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        {/* Unicode upward arrow, or use an SVG if you prefer */}
        ↑
      </button>
    </div>
  );
}

export default App;