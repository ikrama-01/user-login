// src/components/RequestOtp.js
import React, { useState } from 'react';
import axios from 'axios';

const RequestOtp = ({ onRequestOtpSuccess }) => {  // Destructure onRequestOtpSuccess from props
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/request-otp', { email });
      setMessage(response.data.message);
      if (onRequestOtpSuccess) onRequestOtpSuccess(); // Notify parent component of successful OTP request
    } catch (error) {
      // Safely access error response
      const errorMessage = error.response?.data?.message || 'Request OTP failed: ' + error.message;
      setMessage(errorMessage);
    }
  };

  return (
    <div>
      <h2>Request OTP</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleRequestOtp}>Request OTP</button>
      <p>{message}</p>
    </div>
  );
};

export default RequestOtp;
