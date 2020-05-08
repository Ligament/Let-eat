const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const functions = require("firebase-functions");
const request = require("request-promise");
const admin = require("firebase-admin");

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const serviceAccount = JSON.parse(new Buffer(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64'));
const databaseURL = process.env.FIREBASE_DATABASE_URL
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  app.get('/api/createCustomToken', function (request, response) {
    if (request.body.access_token === undefined) {
      const ret = {
        error_message: "AccessToken not found",
      };
      return response.status(400).send(ret);
    }

    return verifyLineToken(request.body)
      .then((customAuthToken) => {
        const ret = {
          firebase_token: customAuthToken,
        };
        return response.status(200).send(ret);
      })
      .catch((err) => {
        const ret = {
          error_message: `Authentication error: ${err}`,
        };
        return response.status(200).send(ret);
      });
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}

function verifyLineToken(body) {
  return request({
    method: 'GET',
    uri: `https://api.line.me/oauth2/v2.1/verify?access_token=${body.access_token}`,
    json: true
  }).then((response) => {
    if (response.client_id !== process.env.LINE_CHANNEL_ID) {
      return Promise.reject(new Error('LINE channel ID mismatched'));
    }
    return getFirebaseUser(body);
  })
  // if (body.channel_id !== functions.config().line.channelid) {
  //   return Promise.reject(new Error("LINE channel ID mismatched"));
  // }
  // return getFirebaseUser(body)
  //   .then((userRecord) => {
  //     return admin.auth().createCustomToken(userRecord.uid);
  //   })
  //   .then((token) => {
  //     return token;
  //   });
}

function getFirebaseUser(body) {
  const firebaseUid = `line:${body.id}`;

  return admin
    .auth()
    .getUser(firebaseUid)
    .then((userRecord) => {
      return userRecord;
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") {
        const user = admin.auth().createUser({
          uid: firebaseUid,
          displayName: body.name,
          photoURL: body.picture,
          email: body.email,
        });
        var users = db.ref("users");
        if (body.position) {
          users.child("business").set({
            firebaseUid: {
              body,
            },
          });
        } else {
          users.child("customer").set({
            firebaseUid: {
              body,
            },
          });
        }
        return user;
      }
      return Promise.reject(error);
    });
}