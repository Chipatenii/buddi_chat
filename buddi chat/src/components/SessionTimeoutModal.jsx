import { useEffect } from 'react';

const SessionTimeoutModal = ({ remaining, onStay }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      if (remaining <= 0) onStay();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remaining, onStay]);

  return (
    <div className="timeout-modal">
      <h2>Session About to Expire</h2>
      <p>You will be logged out in {Math.floor(remaining / 1000)} seconds</p>
      <button onClick={onStay}>Stay Logged In</button>
    </div>
  );
};