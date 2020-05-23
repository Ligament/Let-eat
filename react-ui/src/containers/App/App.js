import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router } from "react-router-dom";
import { useMediaQuery, createMuiTheme, ThemeProvider, responsiveFontSizes } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage"; // make sure you add this for storage
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
// import { createFirestoreInstance } from 'redux-firestore'
import { Provider } from "react-redux";
// import theme from "theme";
import { firebase as fbConfig, reduxFirebase as rfConfig } from "config";

// Initialize Firebase instance
firebase.initializeApp(fbConfig);

function App({ routes, store }) {
  
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  let theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#f06292",
          },
          secondary: {
            main: "#64b5f6",
          },
        },
        typography: {
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            "Saraun",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(","),
          h4: {
            fontSize: 20,
          },
          h5: {
            fontSize: 16,
          },
          h6: {
            fontSize: 14,
          },
          subtitle1: {
            fontSize: 12,
          }
        },
        flexColumnCenter: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        },
        flexRowCenter: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        },
        overrides: {
          MuiButton: {
            contained: {
              borderRadius: 3,
              border: 0,
              color: 'white',
              height: 48,
              padding: '0 30px',
              
            },
            containedPrimary: {
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            },
            containedSecondary: {
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }
          }
        }
      }),
    [prefersDarkMode]
  );
  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ReactReduxFirebaseProvider
          firebase={firebase}
          config={rfConfig}
          dispatch={store.dispatch}
          // createFirestoreInstance={createFirestoreInstance}
        >
          <Router>{routes}</Router>
        </ReactReduxFirebaseProvider>
      </Provider>
    </ThemeProvider>
  );
}

App.propTypes = {
  routes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default App;
