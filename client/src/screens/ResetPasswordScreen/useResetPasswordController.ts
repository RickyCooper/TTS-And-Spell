import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as AuthService from "../../services/AuthService";

type Step = "request" | "verify" | "reset" | "success";

const resolveError = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
};

export const useResetPasswordController = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setError(null);
  }, []);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
    setError(null);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setError(null);
  }, []);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
    setError(null);
  }, []);

  const handleRequestCode = useCallback(async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.forgotPassword(email.trim());
      setStep("verify");
    } catch (err) {
      setError(resolveError(err));
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const handleVerifyCode = useCallback(async () => {
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code we emailed you.");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.verifyResetCode(email.trim(), code);
      setStep("reset");
    } catch (err) {
      setError(resolveError(err));
    } finally {
      setIsLoading(false);
    }
  }, [email, code]);

  const handleResetPassword = useCallback(async () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.resetPassword(email.trim(), code, password);
      setStep("success");
    } catch (err) {
      setError(resolveError(err));
    } finally {
      setIsLoading(false);
    }
  }, [email, code, password, confirmPassword]);

  const handleBackToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return {
    step,
    email,
    error,
    isLoading,
    handleEmailChange,
    handleCodeChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleRequestCode,
    handleVerifyCode,
    handleResetPassword,
    handleResendCode: handleRequestCode,
    handleBackToLogin,
  };
};
