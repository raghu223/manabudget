import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendPasswordReset } from "../../actions/authActions";
import { toast } from "react-toastify";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendPasswordReset(email))
      .then(() => {
        toast.success("Password reset email sent! Please check your inbox.");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Send Password Reset Email</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
