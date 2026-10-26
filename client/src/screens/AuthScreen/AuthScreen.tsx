import styles from "./AuthScreen.module.scss";
import TextInput from "../../components/TextInput/TextInput";
import DateInput from "../../components/DateInput/DateInput";
import Button from "../../components/Button/Button";
import { useAuthController } from "./useAuthController";
import Chip from "../../components/Chip/Chip";
import alertIcon from "../../assets/svg/alert.svg";
import { useNavigate } from "react-router-dom";

type AuthView = "login" | "signup";

const AuthScreen = ({ initialView = "login" }: { initialView?: AuthView }) => {
  const navigate = useNavigate();
  const {
    handleLoginFieldChange,
    handleSignupFieldChange,
    handleLogin,
    handleSignup,
    error,
    isLoading,
  } = useAuthController(initialView);

  if (initialView === "login") {
    return (
      <div className={styles["auth-screen"]}>
        <div className={styles["auth-screen__form"]}>
          <h1 className={styles["auth-screen__title"]}>LOG IN</h1>
          <TextInput
            placeholder="Username or Email"
            variant="form"
            autoFocus={true}
            onChange={(v) => handleLoginFieldChange("identifier", v)}
          />
          <div className={styles["auth-screen__password-group"]}>
            <TextInput
              placeholder="Password"
              type="password"
              variant="form"
              autoFocus={false}
              onChange={(v) => handleLoginFieldChange("password", v)}
              onSubmit={handleLogin}
            />
            <Button
              text="Forgot password?"
              variant="tertiary"
              className={styles["auth-screen__link-small"]}
              onClick={() => navigate("/reset-password")}
            />
          </div>
        </div>
        {error && <Chip icon={alertIcon} variant="error" msg={error}/>}
        <div className={styles["auth-screen__login-group"]}>
          <Button
            text="LOG IN"
            variant="primary"
            color="green"
            onClick={handleLogin}
            disabled={isLoading}
          />
          <div className={styles["auth-screen__actions"]}>
            <Button
              text="Don't have an account? Sign Up"
              variant="tertiary"
              className={styles["auth-screen__link-small"]}
              onClick={() => navigate("/signup")}
            />
          </div>
        </div>
        <Button
          text="Try the demo"
          variant="tertiary"
          className={styles["auth-screen__demo-button"]}
          onClick={() => navigate("/modes")}
        />
      </div>
    );
  }

  return (
    <div className={`${styles["auth-screen"]} ${styles["auth-screen--wide"]}`}>
      <div className={styles["auth-screen__form"]}>
        <h1 className={styles["auth-screen__title"]}>SIGN UP</h1>
        <div className={styles["auth-screen__col"]}>
          <TextInput
            placeholder="Email"
            variant="form"
            autoFocus={true}
            onChange={(v) => handleSignupFieldChange("email", v)}
          />
          <DateInput
            onChange={(v) => handleSignupFieldChange("dateOfBirth", v)}
          />
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
      </div>
      {error && <Chip icon={alertIcon} variant="error" msg={error}/>}
      <div className={styles["auth-screen__login-group"]}>
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
            className={styles["auth-screen__link-small"]}
            onClick={() => navigate("/login")}
          />
        </div>
      </div>
        <Button
          text="Try the demo"
          variant="tertiary"
          className={styles["auth-screen__demo-button"]}
          onClick={() => navigate("/modes")}
        />
    </div>
  );
};

export default AuthScreen;
