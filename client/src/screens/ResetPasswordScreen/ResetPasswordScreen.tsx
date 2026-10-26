import styles from "./ResetPasswordScreen.module.scss";
import TextInput from "../../components/TextInput/TextInput";
import Button from "../../components/Button/Button";
import Chip from "../../components/Chip/Chip";
import alertIcon from "../../assets/svg/alert.svg";
import { useResetPasswordController } from "./useResetPasswordController";

const ResetPasswordScreen = () => {
  const {
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
    handleResendCode,
    handleBackToLogin,
  } = useResetPasswordController();

  return (
    <div className={styles["reset-password-screen"]}>
      <div className={styles["reset-password-screen__form"]}>
        {step === "request" && (
          <>
            <h1 className={styles["reset-password-screen__title"]}>FORGOT PASSWORD</h1>
            <p className={styles["reset-password-screen__helper-text"]}>
              Enter your account email and we'll send you a reset code.
            </p>
            <TextInput
              placeholder="Email"
              variant="form"
              autoFocus={true}
              onChange={handleEmailChange}
              onSubmit={handleRequestCode}
            />
          </>
        )}

        {step === "verify" && (
          <>
            <h1 className={styles["reset-password-screen__title"]}>ENTER CODE</h1>
            <p className={styles["reset-password-screen__helper-text"]}>
              We sent a 6-digit code to {email}.
            </p>
            <TextInput
              placeholder="Reset Code"
              variant="form"
              autoFocus={true}
              onChange={handleCodeChange}
              onSubmit={handleVerifyCode}
            />
          </>
        )}

        {step === "reset" && (
          <>
            <h1 className={styles["reset-password-screen__title"]}>RESET PASSWORD</h1>
            <TextInput
              placeholder="New Password"
              type="password"
              variant="form"
              autoFocus={true}
              onChange={handlePasswordChange}
            />
            <TextInput
              placeholder="Confirm Password"
              type="password"
              variant="form"
              autoFocus={false}
              onChange={handleConfirmPasswordChange}
              onSubmit={handleResetPassword}
            />
          </>
        )}

        {step === "success" && (
          <>
            <h1 className={styles["reset-password-screen__title"]}>PASSWORD RESET</h1>
            <p className={styles["reset-password-screen__helper-text"]}>
              Your password has been reset. You can now log in.
            </p>
          </>
        )}
      </div>

      {error && <Chip icon={alertIcon} variant="error" msg={error}/>}

      {step === "success" ? (
        <Button text="Back to Login" variant="primary" color="green" onClick={handleBackToLogin} />
      ) : (
        <div className={styles["reset-password-screen__login-group"]}>
          {step === "request" && (
            <Button text="Send Code" variant="primary" color="green" onClick={handleRequestCode} disabled={isLoading} />
          )}
          {step === "verify" && (
            <Button text="Verify Code" variant="primary" color="green" onClick={handleVerifyCode} disabled={isLoading} />
          )}
          {step === "reset" && (
            <Button text="Reset Password" variant="primary" color="green" onClick={handleResetPassword} disabled={isLoading} />
          )}
          <Button
            text="Back to Login"
            variant="tertiary"
            className={styles["reset-password-screen__link-small"]}
            onClick={handleBackToLogin}
          />
        </div>
      )}

      {step === "verify" && (
        <div className={styles["reset-password-screen__actions"]}>
          <Button text="Resend code" variant="tertiary" onClick={handleResendCode} disabled={isLoading} />
        </div>
      )}
    </div>
  );
};

export default ResetPasswordScreen;
