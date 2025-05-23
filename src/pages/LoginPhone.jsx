import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../Services/authService";

const LoginPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Redirect to home if already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  const validatePhoneNumber = (number) => {
    // Check if number starts with 0 and has exactly 11 digits
    const phoneRegex = /^0\d{10}$/;
    return phoneRegex.test(number);
  };
  const handleVerifyPhone = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid phone number starting with 3');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyPhone(phoneNumber);
      if (response.exists) {
        toast.success('Phone number verified');
        navigate("/login/password", { 
          state: { 
            phoneNumber: phoneNumber, // This will be a 10-digit number starting with 3
            verified: true 
          } 
        });
      } else {
        toast.error('Phone number not registered');
      }
    } catch (error) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Only allow digits and limit to 11 characters
    let digitsOnly = input.replace(/\D/g, '');
    
    // Ensure the number starts with '0' and limit to 11 digits
    if (digitsOnly.length <= 11 && (!digitsOnly || digitsOnly.startsWith('0'))) {
      setPhoneNumber(digitsOnly);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden relative">
      {/* Logo - Repositioned for better responsiveness */}
      <Link
        to="/"
        className="flex absolute top-4 md:top-8 left-4 md:left-8 items-center z-10"
      >
        <img src="/offerSectionImage34.png" alt="Cheezious Logo" className="w-8 md:w-10" />
        <h1 className="font-bold text-xl md:text-2xl ml-2">Cheezious</h1>
      </Link>

      {/* Left Section */}
      <div className="w-full md:w-1/2 h-full p-4 md:p-8 flex flex-col justify-center items-center bg-background pt-20 md:pt-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-text/90">Enter Your Phone Number</h1>
          <p className="text-text/60 mb-6 md:mb-10">We will send you the code to confirm it.</p>
            <div className="flex w-full mb-6">
            <input
              type="tel"
              placeholder="03XX-XXXXXXX"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}              maxLength={11}
              className="flex-grow p-3 bg-text/5 rounded-lg focus:outline-none"
            />
          </div>
            <button
            onClick={handleVerifyPhone}
            disabled={loading}
            className="flex justify-center items-center w-full py-3 md:py-4 bg-primary text-text/90 font-bold rounded hover:bg-primary/80 hover:brightness-105 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">
              <FaEnvelope size={20} />
            </span>
            {loading ? 'Verifying...' : 'Continue with Phone'}
          </button>
        </div>
      </div>

      {/* Right Section - Using Background Image */}
      <div
        className="hidden md:block w-full md:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: "url(/blog1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};


export default LoginPhone;
