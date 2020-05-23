import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./SignupPage.styles";
import { Button, Grid } from "@material-ui/core";
import liff from "utils/liff";
import { renderChildren } from "utils/router";
import CustomerSignup from "routes/Signup/routes/Customer";
import BusinessSignup from "routes/Signup/routes/Business";

const useStyles = makeStyles(styles);

function SignupPage({ match }) {
  const classes = useStyles();

  useEffect(() => {
    if (liff.isLoggedIn()) {
      liff.getProfile().catch(() => liff.login());
    } else {
      liff.login();
    }
  }, []);
  return (
    <Switch>
      {renderChildren([CustomerSignup, BusinessSignup], match)}
      <Route
        exact
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
          </div>
        )}
      />
    </Switch>
  );
}

SignupPage.propTypes = {
  match: PropTypes.object.isRequired, // from enhancer (withRouter)
};

export default SignupPage;
