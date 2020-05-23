import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { SIGNUP_PATH } from "constants/paths";
import { useNotifications } from "modules/notification";
import LoginForm from "../LoginForm";
import styles from "./LoginPage.styles";
import { Button } from "@material-ui/core";
import liff from "utils/liff";
import Signup from "routes/Signup";

const useStyles = makeStyles(styles);

function LoginPage() {
  const classes = useStyles();
  const firebase = useFirebase();
  const { showError } = useNotifications();

  const onSubmitFail = (formErrs, dispatch, err) =>
    showError(formErrs ? "Form Invalid" : err.message || "Error");
  const googleLogin = () =>
    firebase
      .login({ provider: "google", type: "popup" })
      .catch((err) => showError(err.message));
  const emailLogin = (creds) =>
    firebase.login(creds).catch((err) => showError(err.message));

  // const phoneNumber = "+11234567899" // for US number (123) 456-7899
  // const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
  //   'size': 'invisible',
  // });
  // const phoneLogin = () => {

  //   firebase.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
  //   .then((confirmationResult) => {
  //     // SMS sent. Prompt user to type the code from the message, then sign the
  //     // user in with confirmationResult.confirm(code).
  //     const verificationCode = window.prompt('Please enter the verification ' +
  //         'code that was sent to your mobile device.');
  //     return confirmationResult.confirm(verificationCode);
  //   })
  //   .catch((error) => {
  //     // Error; SMS not sent
  //     // Handle Errors Here
  //     return Promise.reject(error)
  //   });}
  const history = useHistory();

  useEffect(() => {
    liff.login();
    if (liff.isLoggedIn()) {
      liff
        .getFirebaseToken()
        .then((data) =>{
        console.log('data', data);
        
          firebase.login({
            token: data.firebase_token,
            profile: { email: data.email }, // required (optional if updateProfileOnLogin: false config set)
          })
        })
        .catch((err) => (history.push(SIGNUP_PATH)));
    }
  }, []);
  // return
  // (
  // <div className={classes.root}>
  //   <Paper className={classes.panel}>
  //     <LoginForm onSubmit={emailLogin} onSubmitFail={onSubmitFail} />
  //   </Paper>
  //   <div className={classes.orLabel}>or</div>
  //   <div className={classes.providers}>
  //     <Button onClick={googleLogin} data-test="google-auth-button" />
  //   </div>
  //   <div className={classes.signup}>
  //     <span className={classes.signupLabel}>Need an account?</span>
  //     <Link className={classes.signupLink} to={SIGNUP_PATH}>
  //       Sign Up
  //     </Link>
  //   </div>
  // </div>
  // )
  return <></>;
}

export default LoginPage;
