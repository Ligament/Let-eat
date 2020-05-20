import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import { makeStyles } from "@material-ui/core/styles";
import { useNotifications } from "modules/notification";
import styles from "./BusinessPage.styles";
import liff from "utils/liff";
import { signupWithLine } from "store/user";
import BusinessForm from "../BusinessForm";

const useStyles = makeStyles(styles);

function BusinessPage() {
  const classes = useStyles();
  const firebase = useFirebase();
  const profile = useSelector(state => state.firebase.profile)
  const { showError } = useNotifications();

  const onSubmitFail = (formErrs, dispatch, err) =>
    showError(formErrs ? "Form Invalid" : err.message || "Error");
  const withLine = (creds) =>
    liff
      .getProfile()
      .then((pf) =>

        signupWithLine({
          ...pf,
          ...creds,
          name: `${creds.firstName} ${creds.lastName}`,
        }).then(data => {
          firebase.login({
            token : data.firebase_token,
            profile: { email: pf.email } // required (optional if updateProfileOnLogin: false config set)
          }).then(liff.closeWindow()).catch(err => showError(err.message))
        })
      )
      .catch((err) => showError(err.message));
  return (
    <div className={classes.root}>
      {/* <Paper className={classes.panel}> */}
      <BusinessForm onSubmit={withLine} onSubmitFail={onSubmitFail} />
      {/* </Paper> */}
      {/* <div className={classes.orLabel}>or</div>
      <div className={classes.providers}>
        <Button onClick={googleLogin} data-test="google-auth-button" />
      </div>
      <div className={classes.login}>
        <span className={classes.loginLabel}>Already have an account?</span>
        <Link className={classes.loginLink} to={LOGIN_PATH}>
          Login
        </Link>
      </div> */}
    </div>
  );
}

export default BusinessPage;
