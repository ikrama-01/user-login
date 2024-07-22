import React, { useState } from 'react';
import Register from './components/Register';
import RequestOtp from './components/RequestOtp';
import VerifyOtp from './components/VerifyOtp';
import './App.css';

function App() {
  const [step, setStep] = useState(1); // Start at step 1

  // Function to handle moving to the next step
  const goToNextStep = () => {
    setStep(step + 1);
  };

  return (
    <div className="App">
      <h1>User Login System</h1>
      {step === 1 && <Register onRegisterSuccess={goToNextStep} />}
      {step === 2 && <RequestOtp onRequestOtpSuccess={goToNextStep} />}
      {step === 3 && <VerifyOtp />}
    </div>
  );
}

export default App;
