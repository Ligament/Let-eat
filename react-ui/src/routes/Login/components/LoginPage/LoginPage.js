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
  const history = useHistory();

  useEffect(() => {
    liff.login();
    if (liff.isLoggedIn()) {
      liff
        .getFirebaseToken()
        .then((data) =>{
          firebase.login({
            token: data.firebase_token,
            profile: { email: data.email }, // required (optional if updateProfileOnLogin: false config set)
          })
        })
        .catch((err) => (history.push(SIGNUP_PATH)));
    }
  }, []);
  return <></>;
}

export default LoginPage;
