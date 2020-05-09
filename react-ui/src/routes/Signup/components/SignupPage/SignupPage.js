import React, { useEffect } from "react";
import PropTypes from 'prop-types'
import { Link, Route, Switch } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { useFirebase } from "react-redux-firebase";
import { makeStyles } from "@material-ui/core/styles";
import { LOGIN_PATH } from "constants/paths";
import { useNotifications } from "modules/notification";
import SignupForm from "../SignupForm";
import styles from "./SignupPage.styles";
import { Button, Grid } from "@material-ui/core";
import liff from "utils/liff";
import fetch from "isomorphic-fetch";
import { CREATE_CUSTOM_TOKEN } from "constants/apiPaths";
import { createAction } from "redux-api-middleware";
import { signupWithLine } from "store/user";
import { line } from "config";
import { renderChildren } from "utils/router";
import CustomerSignup from "routes/Signup/routes/Customer";
import BusinessSignup from "routes/Signup/routes/Business";

const useStyles = makeStyles(styles);

function SignupPage( {match} ) {
  const classes = useStyles();
  const firebase = useFirebase();
  const { showError } = useNotifications();

  const onSubmitFail = (formErrs, dispatch, err) =>
    showError(formErrs ? "Form Invalid" : err.message || "Error");
  const googleLogin = () =>
    firebase
      .login({ provider: "google", type: "popup" })
      .catch((err) => showError(err.message));
  const emailSignup = (creds) =>
    firebase
      .createUser(creds, {
        email: creds.email,
        username: creds.username,
      })
      .catch((err) => showError(err.message));
  const withLine = (creds) =>
    liff
      .getProfile()
      .then((pf) =>
        signupWithLine({
          ...creds,
          access_token: pf.access_token,
          id: pf.userId,
          displayName: pf.displayName,
          picture: pf.pictureUrl,
          email: pf.email,
          name: `${creds.firstName} ${creds.lastName}`,
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
  useEffect(() => {
    // liff
    //   .init(line.signup)
    //   .then((env) => {
    //     liff.loginWithLine();
    //   })
    //   .catch((err) => console.log(err));
  }, []);
  return (
    <Switch>
      {renderChildren([CustomerSignup, BusinessSignup], match)}
      <Route exact
        path={match.path}
        render={() => (
      <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item>
              <Button
                variant="contained"
                component={Link}
                to="/signup/customer"
                color="primary"
              >
                Customer
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component={Link}
                to="/signup/business"
                color="secondary"
              >
                Business
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </div>)} />
    </Switch>
      // {/* <Paper className={classes.panel}> */}
      // {/* <SignupForm onSubmit={withLine} onSubmitFail={onSubmitFail} /> */}
      // {/* </Paper> */}
      // {/* <div className={classes.orLabel}>or</div>
      // <div className={classes.providers}>
      //   <Button onClick={googleLogin} data-test="google-auth-button" />
      // </div>
      // <div className={classes.login}>
      //   <span className={classes.loginLabel}>Already have an account?</span>
      //   <Link className={classes.loginLink} to={LOGIN_PATH}>
      //     Login
      //   </Link>
      // </div> */}
    
  );
}

SignupPage.propTypes = {
  match: PropTypes.object.isRequired, // from enhancer (withRouter)
}

export default SignupPage;
