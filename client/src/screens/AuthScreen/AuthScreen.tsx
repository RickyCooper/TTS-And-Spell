import styles from "./AuthScreen.module.scss";
import TextInput from "../../components/TextInput/TextInput";
import DateInput from "../../components/DateInput/DateInput";
import Button from "../../components/Button/Button";
import { useAuthController } from "./useAuthController";

const AuthScreen = () => {
  const {
    view,
    switchView,
    handleLoginFieldChange,
    handleSignupFieldChange,
    handleLogin,
    handleSignup,
    error,
    isLoading,
  } = useAuthController();

  if (view === "login") {
    return (
      <div className={styles["auth-screen"]}>
        <h1 className={styles["auth-screen__title"]}>LOGIN</h1>
        <div className={styles["auth-screen__form"]}>
          <TextInput
            placeholder="Username or Email"
            variant="form"
            autoFocus={true}
            onChange={(v) => handleLoginFieldChange("identifier", v)}
          />
          <TextInput
            placeholder="Password"
            type="password"
            variant="form"
            autoFocus={false}
            onChange={(v) => handleLoginFieldChange("password", v)}
            onSubmit={handleLogin}
          />
        </div>
        {error && <p className={styles["auth-screen__error"]}>{error}</p>}
          <Button
            text="LOGIN"
            variant="primary"
            color="green"
            onClick={handleLogin}
            disabled={isLoading}
          />
        <div className={styles["auth-screen__actions"]}>
          <Button
            text="Don't have an account? sign up"
            variant="tertiary"
            onClick={() => switchView("signup")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles["auth-screen"]} ${styles["auth-screen--wide"]}`}>
      <h1 className={styles["auth-screen__title"]}>SIGN UP</h1>
      <div className={styles["auth-screen__form"]}>
        <div className={styles["auth-screen__row"]}>
          <TextInput
            placeholder="Email"
            variant="form"
            autoFocus={true}
            onChange={(v) => handleSignupFieldChange("email", v)}
          />
          <DateInput
            onChange={(v) => handleSignupFieldChange("dateOfBirth", v)}
          />
        </div>
        <div className={styles["auth-screen__row"]}>
          <TextInput
            placeholder="Username"
            variant="form"
            autoFocus={false}
            onChange={(v) => handleSignupFieldChange("username", v)}
          />
          <TextInput
            placeholder="Password"
            type="password"
            variant="form"
            autoFocus={false}
            onChange={(v) => handleSignupFieldChange("password", v)}
            onSubmit={handleSignup}
          />
        </div>
        <TextInput
          multiline
          rows={4}
          variant="form"
          autoFocus={false}
          placeholder="TTS & Spell is currently in closed beta. Share why you're interested in early access and we'll review your request."
        />
      </div>
      {error && <p className={styles["auth-screen__error"]}>{error}</p>}
        <Button
          text="SIGN UP"
          variant="primary"
          color="green"
          onClick={handleSignup}
          disabled={isLoading}
        />
      <div className={styles["auth-screen__actions"]}>
        <Button
          text="already have an account? log in"
          variant="tertiary"
          onClick={() => switchView("login")}
        />
      </div>
    </div>
  );
};

export default AuthScreen;
