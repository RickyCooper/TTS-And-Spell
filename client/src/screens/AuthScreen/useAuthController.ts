import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import type { LoginInput, RegisterInput } from "../../types/AuthTypes";

type AuthView = "login" | "signup";

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_TAKEN: "This email is already registered.",
  USERNAME_TAKEN: "This username is already taken.",
  INVALID_CREDENTIALS: "Incorrect username or password.",
};

const resolveError = (err: unknown): string => {
  if (err instanceof Error) {
    return ERROR_MESSAGES[err.message] ?? err.message;
  }
  return "Something went wrong. Please try again.";
};

export const useAuthController = (_initialView?: AuthView) => {
  const { login, signup, isLoading } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const [loginFields, setLoginFields] = useState<LoginInput>({
    identifier: "",
    password: "",
  });

  const [signupFields, setSignupFields] = useState<RegisterInput>({
    email: "",
    dateOfBirth: "",
    username: "",
    password: "",
  });

  const handleLoginFieldChange = useCallback(
    (field: keyof LoginInput, value: string) => {
      setLoginFields((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    [],
  );

  const handleSignupFieldChange = useCallback(
    (field: keyof RegisterInput, value: string) => {
      setSignupFields((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    [],
  );

  const handleLogin = useCallback(async () => {
    if (!loginFields.identifier.trim() || !loginFields.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await login(loginFields);
      navigate("/modes");
    } catch (err) {
      setError(resolveError(err));
    }
  }, [login, loginFields]);

  const handleSignup = useCallback(async () => {
    const { email, dateOfBirth, username, password } = signupFields;
    if (!email.trim() || !dateOfBirth.trim() || !username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await signup(signupFields);
      navigate("/modes");
    } catch (err) {
      setError(resolveError(err));
    }
  }, [signup, signupFields]);

  return {
    loginFields,
    signupFields,
    handleLoginFieldChange,
    handleSignupFieldChange,
    handleLogin,
    handleSignup,
    error,
    isLoading,
  };
};
