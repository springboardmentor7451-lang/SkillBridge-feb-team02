import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { X } from "lucide-react";
import DemoImg from "/auth-modal-illustrate.png";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-225 max-w-[95%] h-155 rounded-3xl flex shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-transparent border rounded-full p-1 text-2xl cursor-pointer text-slate-500 z-10 hover:text-slate-600 transition-colors "
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="hidden lg:flex flex-1 bg-[#FCFEFC] flex-col justify-between p-10 text-white relative">
          <img src={DemoImg} alt="" />
        </div>

        <div className="flex-1 px-8 py-5 md:px-14 flex flex-col justify-center bg-[#FCFEFC]">
          {mode === "login" ? (
            <LoginForm
              switchToSignup={() => setMode("signup")}
              onSuccess={onClose}
            />
          ) : (
            <SignupForm
              switchToLogin={() => setMode("login")}
              onSuccess={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
