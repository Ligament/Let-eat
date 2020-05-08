const express = require("express");
const path = require("path");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const request = require("request-promise");
const admin = require("firebase-admin");
const line = require('@line/bot-sdk');
const fs = require('fs');
const cp = require('child_process');

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

const serviceAccount = JSON.parse(
  new Buffer(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64")
);

const databaseURL = process.env.FIREBASE_DATABASE_URL;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// base URL for webhook server
let baseURL = process.env.BASE_URL;

// create LINE SDK client
const client = new line.Client(config);

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../react-ui/build")));
  // serve static and downloaded files
  app.use("/static", express.static(path.resolve(__dirname, "../server/static")));
  app.use("/downloaded", express.static(path.resolve(__dirname, "../server/downloaded")));

  // Answer API requests.
  app.get("/api", function (req, res) {
    res.set("Content-Type", "application/json");
    res.send('{"message":"Hello from the custom server!"}');
  });

  app.get("/api/createCustomToken", function (request, response) {
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

  app.post("/api/richMenu", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");

    let richMenuId1 = "YOUR-RICH-MENU-ID-1";
    let richMenuId2 = "YOUR-RICH-MENU-ID-2";

    if (req.body.uid !== undefined) {
      // คุณอาจทำการ auth ด้วย username และ password ที่ผู้ใช้กรอกมา
      // และคุณอาจเก็บข้อมูล uid ลง db เพื่อผูกกับ existing account เดิมที่มีอยู่ในระบบ
      link(req.body.uid, richMenuId1);
    } else {
      let event = req.body.events[0];
      if (event.type === "postback") {
        switch (event.postback.data) {
          case "richmenu1":
            link(event.source.userId, richMenuId1);
            break;
          case "richmenu2":
            link(event.source.userId, richMenuId2);
            break;
        }
      }
    }

    return res.status(200).send(req.method);
  });

  app.get("/callback", (req, res) =>
    res.end(`I'm listening. Please access with POST.`)
  );

  // webhook callback
  app.post("/callback", line.middleware(config), (req, res) => {
    if (req.body.destination) {
      console.log("Destination User ID: " + req.body.destination);
    }

    // req.body.events should be an array of events
    if (!Array.isArray(req.body.events)) {
      return res.status(500).end();
    }

    // handle events separately
    Promise.all(req.body.events.map(handleEvent))
      .then(() => res.end())
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get("*", function (request, response) {
    response.sendFile(
      path.resolve(__dirname, "../react-ui/build", "index.html")
    );
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    );
  });
}

function verifyLineToken(body) {
  return request({
    method: "GET",
    uri: `https://api.line.me/oauth2/v2.1/verify?access_token=${body.access_token}`,
    json: true,
  }).then((response) => {
    if (response.client_id !== process.env.LINE_CHANNEL_ID) {
      return Promise.reject(new Error("LINE channel ID mismatched"));
    }
    return getFirebaseUser(body);
  });
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

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: "text", text }))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    return console.log("Test hook recieved: " + JSON.stringify(event.message));
  }

  switch (event.type) {
    case "message":
      const message = event.message;
      switch (message.type) {
        case "text":
          return handleText(message, event.replyToken, event.source);
        case "image":
          return handleImage(message, event.replyToken);
        case "video":
          return handleVideo(message, event.replyToken);
        case "audio":
          return handleAudio(message, event.replyToken);
        case "location":
          return handleLocation(message, event.replyToken);
        case "sticker":
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case "follow":
      return replyText(event.replyToken, "Got followed event");

    case "unfollow":
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case "join":
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case "leave":
      return console.log(`Left: ${JSON.stringify(event)}`);

    case "postback":
      let data = event.postback.data;
      if (data === "DATE" || data === "TIME" || data === "DATETIME") {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return replyText(event.replyToken, `Got postback: ${data}`);

    case "beacon":
      return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken, source) {
  const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;

  switch (message.text) {
    case "profile":
      if (source.userId) {
        return client
          .getProfile(source.userId)
          .then((profile) =>
            replyText(replyToken, [
              `Display name: ${profile.displayName}`,
              `Status message: ${profile.statusMessage}`,
            ])
          );
      } else {
        return replyText(
          replyToken,
          "Bot can't use profile API without user ID"
        );
      }
    case "buttons":
      return client.replyMessage(replyToken, {
        type: "template",
        altText: "Buttons alt text",
        template: {
          type: "buttons",
          thumbnailImageUrl: buttonsImageURL,
          title: "My button sample",
          text: "Hello, my button",
          actions: [
            { label: "Go to line.me", type: "uri", uri: "https://line.me" },
            {
              label: "Say hello1",
              type: "postback",
              data: "hello こんにちは",
            },
            {
              label: "言 hello2",
              type: "postback",
              data: "hello こんにちは",
              text: "hello こんにちは",
            },
            { label: "Say message", type: "message", text: "Rice=米" },
          ],
        },
      });
    case "confirm":
      return client.replyMessage(replyToken, {
        type: "template",
        altText: "Confirm alt text",
        template: {
          type: "confirm",
          text: "Do it?",
          actions: [
            { label: "Yes", type: "message", text: "Yes!" },
            { label: "No", type: "message", text: "No!" },
          ],
        },
      });
    case "carousel":
      return client.replyMessage(replyToken, {
        type: "template",
        altText: "Carousel alt text",
        template: {
          type: "carousel",
          columns: [
            {
              thumbnailImageUrl: buttonsImageURL,
              title: "hoge",
              text: "fuga",
              actions: [
                {
                  label: "Go to line.me",
                  type: "uri",
                  uri: "https://line.me",
                },
                {
                  label: "Say hello1",
                  type: "postback",
                  data: "hello こんにちは",
                },
              ],
            },
            {
              thumbnailImageUrl: buttonsImageURL,
              title: "hoge",
              text: "fuga",
              actions: [
                {
                  label: "言 hello2",
                  type: "postback",
                  data: "hello こんにちは",
                  text: "hello こんにちは",
                },
                { label: "Say message", type: "message", text: "Rice=米" },
              ],
            },
          ],
        },
      });
    case "image carousel":
      return client.replyMessage(replyToken, {
        type: "template",
        altText: "Image carousel alt text",
        template: {
          type: "image_carousel",
          columns: [
            {
              imageUrl: buttonsImageURL,
              action: {
                label: "Go to LINE",
                type: "uri",
                uri: "https://line.me",
              },
            },
            {
              imageUrl: buttonsImageURL,
              action: {
                label: "Say hello1",
                type: "postback",
                data: "hello こんにちは",
              },
            },
            {
              imageUrl: buttonsImageURL,
              action: {
                label: "Say message",
                type: "message",
                text: "Rice=米",
              },
            },
            {
              imageUrl: buttonsImageURL,
              action: {
                label: "datetime",
                type: "datetimepicker",
                data: "DATETIME",
                mode: "datetime",
              },
            },
          ],
        },
      });
    case "datetime":
      return client.replyMessage(replyToken, {
        type: "template",
        altText: "Datetime pickers alt text",
        template: {
          type: "buttons",
          text: "Select date / time !",
          actions: [
            {
              type: "datetimepicker",
              label: "date",
              data: "DATE",
              mode: "date",
            },
            {
              type: "datetimepicker",
              label: "time",
              data: "TIME",
              mode: "time",
            },
            {
              type: "datetimepicker",
              label: "datetime",
              data: "DATETIME",
              mode: "datetime",
            },
          ],
        },
      });
    case "imagemap":
      return client.replyMessage(replyToken, {
        type: "imagemap",
        baseUrl: `${baseURL}/static/rich`,
        altText: "Imagemap alt text",
        baseSize: { width: 1040, height: 1040 },
        actions: [
          {
            area: { x: 0, y: 0, width: 520, height: 520 },
            type: "uri",
            linkUri: "https://store.line.me/family/manga/en",
          },
          {
            area: { x: 520, y: 0, width: 520, height: 520 },
            type: "uri",
            linkUri: "https://store.line.me/family/music/en",
          },
          {
            area: { x: 0, y: 520, width: 520, height: 520 },
            type: "uri",
            linkUri: "https://store.line.me/family/play/en",
          },
          {
            area: { x: 520, y: 520, width: 520, height: 520 },
            type: "message",
            text: "URANAI!",
          },
        ],
        video: {
          originalContentUrl: `${baseURL}/static/imagemap/video.mp4`,
          previewImageUrl: `${baseURL}/static/imagemap/preview.jpg`,
          area: {
            x: 280,
            y: 385,
            width: 480,
            height: 270,
          },
          externalLink: {
            linkUri: "https://line.me",
            label: "LINE",
          },
        },
      });
    case "bye":
      switch (source.type) {
        case "user":
          return replyText(replyToken, "Bot can't leave from 1:1 chat");
        case "group":
          return replyText(replyToken, "Leaving group").then(() =>
            client.leaveGroup(source.groupId)
          );
        case "room":
          return replyText(replyToken, "Leaving room").then(() =>
            client.leaveRoom(source.roomId)
          );
      }
    default:
      console.log(`Echo message to ${replyToken}: ${message.text}`);
      return replyText(replyToken, message.text);
  }
}

function handleImage(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(
      __dirname,
      "downloaded",
      `${message.id}.jpg`
    );
    const previewPath = path.join(
      __dirname,
      "downloaded",
      `${message.id}-preview.jpg`
    );

    getContent = downloadContent(message.id, downloadPath).then(
      (downloadPath) => {
        // ImageMagick is needed here to run 'convert'
        // Please consider about security and performance by yourself
        cp.execSync(
          `convert -resize 240x jpeg:${downloadPath} jpeg:${previewPath}`
        );

        return {
          originalContentUrl:
            baseURL + "/downloaded/" + path.basename(downloadPath),
          previewImageUrl:
            baseURL + "/downloaded/" + path.basename(previewPath),
        };
      }
    );
  } else if (message.contentProvider.type === "external") {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({ originalContentUrl, previewImageUrl }) => {
    return client.replyMessage(replyToken, {
      type: "image",
      originalContentUrl,
      previewImageUrl,
    });
  });
}

function handleVideo(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(
      __dirname,
      "downloaded",
      `${message.id}.mp4`
    );
    const previewPath = path.join(
      __dirname,
      "downloaded",
      `${message.id}-preview.jpg`
    );

    getContent = downloadContent(message.id, downloadPath).then(
      (downloadPath) => {
        // FFmpeg and ImageMagick is needed here to run 'convert'
        // Please consider about security and performance by yourself
        cp.execSync(`convert mp4:${downloadPath}[0] jpeg:${previewPath}`);

        return {
          originalContentUrl:
            baseURL + "/downloaded/" + path.basename(downloadPath),
          previewImageUrl:
            baseURL + "/downloaded/" + path.basename(previewPath),
        };
      }
    );
  } else if (message.contentProvider.type === "external") {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({ originalContentUrl, previewImageUrl }) => {
    return client.replyMessage(replyToken, {
      type: "video",
      originalContentUrl,
      previewImageUrl,
    });
  });
}

function handleAudio(message, replyToken) {
  let getContent;
  if (message.contentProvider.type === "line") {
    const downloadPath = path.join(
      __dirname,
      "downloaded",
      `${message.id}.m4a`
    );

    getContent = downloadContent(message.id, downloadPath).then(
      (downloadPath) => {
        return {
          originalContentUrl:
            baseURL + "/downloaded/" + path.basename(downloadPath),
        };
      }
    );
  } else {
    getContent = Promise.resolve(message.contentProvider);
  }

  return getContent.then(({ originalContentUrl }) => {
    return client.replyMessage(replyToken, {
      type: "audio",
      originalContentUrl,
      duration: message.duration,
    });
  });
}

function downloadContent(messageId, downloadPath) {
  return client.getMessageContent(messageId).then(
    (stream) =>
      new Promise((resolve, reject) => {
        const writable = fs.createWriteStream(downloadPath);
        stream.pipe(writable);
        stream.on("end", () => resolve(downloadPath));
        stream.on("error", reject);
      })
  );
}

function handleLocation(message, replyToken) {
  return client.replyMessage(replyToken, {
    type: "location",
    title: message.title,
    address: message.address,
    latitude: message.latitude,
    longitude: message.longitude,
  });
}

function handleSticker(message, replyToken) {
  return client.replyMessage(replyToken, {
    type: "sticker",
    packageId: message.packageId,
    stickerId: message.stickerId,
  });
}