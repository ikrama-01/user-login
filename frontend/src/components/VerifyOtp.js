import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerifyOtp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isButtonLocked, setIsButtonLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0); // Time in milliseconds
  const [attempts, setAttempts] = useState(0);

  // Unlock button after lockout period
  useEffect(() => {
    let timer;
    if (isButtonLocked && lockoutTime > 0) {
      timer = setTimeout(() => {
        setIsButtonLocked(false);
        setAttempts(0); // Reset attempts after lockout
      }, lockoutTime);
    }
    return () => clearTimeout(timer);
  }, [isButtonLocked, lockoutTime]);

  const handleVerifyOtp = async () => {
    if (isButtonLocked) {
      setMessage('Too many requests. Please wait.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
      setMessage('Login successful. Token: ' + response.data.token);
      setAttempts(0); // Reset attempts on successful verification
    } catch (error) {
      setMessage('Verification failed: ' + error.response.data.message);
      setAttempts(prevAttempts => {
        const newAttempts = prevAttempts + 1;
        if (newAttempts >= 5) {
          setIsButtonLocked(true);
          setLockoutTime(30000);
          alert("you will be able to attempt ater 30 seconds");
        }
        return newAttempts;
      });
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOtp} disabled={isButtonLocked}>
        Verify OTP
      </button>
      <p>{message}</p>
    </div>
  );
};

export default VerifyOtp;
