import React, { useEffect } from "react";
import { useFirebase } from "react-redux-firebase";
import { makeStyles } from "@material-ui/core/styles";
import { useNotifications } from "modules/notification";
import styles from "./CustomerPage.styles";
import liff from "utils/liff";
import { signupWithLine, signupWithLine2 } from "store/user";
import CustomerForm from "../CustomerForm";

const useStyles = makeStyles(styles);

function CustomerPage() {
  const classes = useStyles();
  const firebase = useFirebase();
  const { showError } = useNotifications();

  const onSubmitFail = (formErrs, dispatch, err) =>
    showError(formErrs ? "Form Invalid" : err.message || "Error");
  const withLine = (creds) =>
    liff
      .getProfile()
      .then((pf) => signupWithLine2(pf).then(data => {
        console.log(data);
        liff.closeWindow()
        // {
        //   signupWithLine({
        //     ...creds,
        //     access_token: pf.access_token,
        //     id: pf.userId,
        //     displayName: pf.displayName,
        //     picture: pf.pictureUrl,
        //     email: pf.email,
        //     name: `${creds.firstName} ${creds.lastName}`,
        //   });
        //   if (liff.isInClient()) {
        //     liff.closeWindow();
        //   }
        }) 
      )
      .catch((err) => showError(err.message));
  // const singupWithLine = (creds) => {
  //   liff.getProfile().then(
  //     (pf) =>
  //       firebase
  //         .auth()
  //         .createUser(creds, {
  //           uid: `line:${pf.id}`,
  //           displayName: pf.name,
  //           photo: pf.picture,
  //           email: pf.email,
  //         })
  //         .then((userRecord) => {
  //           return firebase.auth().createCustomToken(userRecord.uid);
  //         })
  //         .then((token) => {
  //           console.log(token);
  //         })
  //         .catch((err) => showError(err.message))
  //     // console.log(pf)
  //   );
  // };
  // useEffect(() => {
  //   liff.loginWithLine();
  // }, []);
  return (
    <div className={classes.root}>
      {/* <Paper className={classes.panel}> */}
      <CustomerForm onSubmit={withLine} onSubmitFail={onSubmitFail} />
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

export default CustomerPage;
