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

export async function signupWithLine(data) {
  // Default options are marked with *
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const response = await fetch('/api/createCustomToken', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: myHeaders,
    // mode: 'no-cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    // headers: {
      // 'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
    //redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const getLoginToken = (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return new Promise((resolve, reject) => {
    fetch(
      "/api/createCustomToken",
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
