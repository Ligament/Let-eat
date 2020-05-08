// ------------------------------------
// Constants

import { createAction } from "redux-api-middleware";
import { useFirebase } from "react-redux-firebase";

// ------------------------------------
export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

// ------------------------------------
// Actions
// ------------------------------------
export const signupWithLine = (data) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    mode: "no-cors",
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
  };

  console.log(requestOptions);
  // fetch(
  //   "https://asia-northeast1-teyisabot.cloudfunctions.net/createCustomToken",
  //   requestOptions
  // )
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  fetch(
    "https://asia-northeast1-teyisabot.cloudfunctions.net/createCustomToken",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  // return (dispatch, getState) => {
  //   const actionResponse = dispatch(
  //     createAction({
  //       endpoint:
  //         "https://asia-northeast1-teyisabot.cloudfunctions.net/createCustomToken",
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //       types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
  //     })
  //   );
  //   console.log("actionResponse", actionResponse);
  //   // if (actionResponse.error) {
  //   //   // the last dispatched action has errored, break out of the promise chain.
  //   //   throw new Error("Promise flow received action error", actionResponse);
  //   // }

  //   // you can EITHER return the above resolved promise (actionResponse) here...
  //   // return actionResponse;

  //   // return dispatch(
  //   //   actionResponse
  //   // );
  // };
};

const getLoginToken = (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return new Promise((resolve, reject) => {
    fetch(
      "https://asia-northeast1-teyisabot.cloudfunctions.net/createCustomToken",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

// export function loginFirebaseWithLine(id) {
//   const firebase = useFirebase();
//   getLoginToken({ id }).then((token) => {
//     firebase
//       .login({ token: token.firebase_token })
//       .catch((err) => console.log(err));
//   });
// }

// ------------------------------------
// Specialized Action Creator
// ------------------------------------

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null;
export default function userReducer(state = initialState, action) {
  if (action.type === SIGNUP_SUCCESS) console.log("user action", action);

  return action.type === SIGNUP_SUCCESS ? action.payload : state;
}
