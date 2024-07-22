// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', { email });
      setMessage(response.data.message);
      if (onRegisterSuccess) onRegisterSuccess(); // Notify parent component of successful registration
    } catch (error) {
      setMessage('Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;
