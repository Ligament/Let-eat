const line = require("@line/bot-sdk");
const fs = require("fs");
const cp = require("child_process");

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
        return replyText(event.replyToken, `Got postback: ${data}`);
      } else if (data === "bookAtable") {
        return client.linkRichMenuToUser(
          event.source.userId,
          process.env.BOOKATABLE_RICH_MENU_ID
        );
      } else if (data === "backToMain") {
        return client.linkRichMenuToUser(
          event.source.userId,
          process.env.CUSTOMER_RICH_MENU_ID
        );
      } else if (data.includes("bookATableConfirm")) {
        return handleBookATableConfirm(data, event.replyToken);
      } else if (data.includes("bookATable")) {
        return handleBookATable(data, event.replyToken);
      } else if (data === "resvATable") {
        var d = [];
        var bookATable = db.ref("restaurant");
        bookATable.child("book_a_table").once("value", (data) => {
          d = data.val();
          // d.map((table, ind) => {
          //   return `โต๊ะที่ ${table}`;
          // });
          // console.log(d);
          // d.map((id, table) => {
          //   return `โต๊ะที่ ${table.table_book}`;
          // });
          // console.log("not joid", d);
          // console.log("join", d.join());
          var table_book = "";
          for (var exKey in d) {
            table_book += `โต๊ะ ${d[exKey].table_book} \n`;
            // replyText(event.replyToken, `โต๊ะที่ ${exKey[exKey]}`);
            // console.log("key:"+exKey+", value:"+exjson[exKey]);
          }

          replyText(event.replyToken, `${table_book}`);
        });
        return replyText(event.replyToken, d);
      } else if (data === "resvAMenu") {
        var d = [];
        var bookATable = db.ref("restaurant");
        bookATable.child("book_a_menu").once("value", (data) => {
          d = data.val();
          // d.map((table, ind) => {
          //   return `โต๊ะที่ ${table}`;
          // });
          var menu = "";
          for (var exKey in d) {
            menu += `เมนู ${d[exKey].menu} \n`;
            // console.log("key:"+exKey+", value:"+exjson[exKey]);
          }
          replyText(event.replyToken, `เมนูที่ถูกสั่งคือ ${menu}`);
          // console.log(d);
          // d.map((id, table) => {
          //   return `เมนู ${table.menu}`;
          // });
          // array.forEach(element => {

          // });
          // console.log('not joid',d);
          // console.log('join',d.join());

          // replyText(event.replyToken, d.join());
          // console.log(data);

          // d = data.map((table, ind) => {
          //   return `เมนู ${table}`;
          // });
          // replyText(event.replyToken, d);
        });
        return replyText(event.replyToken, d);
      } else if (data === "menu") {
        return client.replyMessage(event.replyToken, {
          type: "flex",
          altText: "Flex Message",
          contents: {
            type: "carousel",
            contents: [
              {
                type: "bubble",
                direction: "ltr",
                hero: {
                  type: "image",
                  url:
                    "https://www.matichon.co.th/wp-content/uploads/2019/08/17TaoTarn-ลิ้นหมูย่าง.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    label: "Action",
                    uri: "https://linecorp.com",
                  },
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  action: {
                    type: "uri",
                    label: "Action",
                    uri: "https://linecorp.com",
                  },
                  contents: [
                    {
                      type: "text",
                      text: "พวงนมหมูย่าง",
                      size: "xl",
                      weight: "bold",
                    },
                    {
                      type: "text",
                      text: "Sauce, Onions, Pickles, Lettuce & Cheese",
                      size: "xxs",
                      color: "#AAAAAA",
                      wrap: true,
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "spacer",
                        },
                        {
                          type: "text",
                          text: "59฿",
                          align: "end",
                        },
                      ],
                    },
                  ],
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "สั่งเมนูนี้",
                        text: "พวงนมหมูย่าง",
                        data: "menu001",
                      },
                      color: "#FE6B8B",
                      style: "primary",
                    },
                  ],
                },
              },
              {
                type: "bubble",
                direction: "ltr",
                hero: {
                  type: "image",
                  url:
                    "https://ginngai.com/wp-content/uploads/2019/10/ปลาทับทิม-4513-1024x538.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    label: "Action",
                    uri: "https://linecorp.com",
                  },
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  action: {
                    type: "uri",
                    label: "Action",
                    uri: "https://linecorp.com",
                  },
                  contents: [
                    {
                      type: "text",
                      text: "ปลาทับทิมผัดขมิ้นขาว",
                      size: "xl",
                      weight: "bold",
                    },
                    {
                      type: "text",
                      text: "Sauce, Onions, Pickles, Lettuce & Cheese",
                      size: "xxs",
                      color: "#AAAAAA",
                      wrap: true,
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "spacer",
                        },
                        {
                          type: "text",
                          text: "200฿",
                          align: "end",
                        },
                      ],
                    },
                  ],
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "สั่งเมนูนี้",
                        text: "ปลาทับทิมผัดขมิ้นขาว",
                        data: "menu002",
                      },
                      color: "#FE6B8B",
                      style: "primary",
                    },
                  ],
                },
              },
              {
                type: "bubble",
                direction: "ltr",
                hero: {
                  type: "image",
                  url: "https://i.ytimg.com/vi/Y7_Ut9q1ohw/maxresdefault.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    label: "Action",
                    uri: "https://linecorp.com",
                  },
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  action: {
                    type: "uri",
                    label: "Action",
                    uri: "https://linecorp.com",
                  },
                  contents: [
                    {
                      type: "text",
                      text: "ไข่พะโล้",
                      size: "xl",
                      weight: "bold",
                    },
                    {
                      type: "text",
                      text: "Sauce, Onions, Pickles, Lettuce & Cheese",
                      size: "xxs",
                      color: "#AAAAAA",
                      wrap: true,
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "spacer",
                        },
                        {
                          type: "text",
                          text: "69฿",
                          align: "end",
                        },
                      ],
                    },
                  ],
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "สั่งเมนูนี้",
                        text: "ไข่พะโล้",
                        data: "menu003",
                      },
                      color: "#FE6B8B",
                      style: "primary",
                    },
                  ],
                },
              },
              {
                type: "bubble",
                direction: "ltr",
                hero: {
                  type: "image",
                  url: "https://img.kapook.com/u/2017/surauch/cooking/z2.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "cover",
                  action: {
                    type: "uri",
                    label: "Action",
                    uri: "https://linecorp.com",
                  },
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  action: {
                    type: "uri",
                    label: "Action",
                    uri: "https://linecorp.com",
                  },
                  contents: [
                    {
                      type: "text",
                      text: "ไก่ทอดหาดใหญ่",
                      size: "xl",
                      weight: "bold",
                    },
                    {
                      type: "text",
                      text: "Sauce, Onions, Pickles, Lettuce & Cheese",
                      size: "xxs",
                      color: "#AAAAAA",
                      wrap: true,
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "spacer",
                        },
                        {
                          type: "text",
                          text: "79฿",
                          align: "end",
                        },
                      ],
                    },
                  ],
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "สั่งเมนูนี้",
                        text: "ไก่ทอดหาดใหญ่",
                        data: "menu004",
                      },
                      color: "#FE6B8B",
                      style: "primary",
                    },
                  ],
                },
              },
            ],
          },
        });
      } else if (data.includes("menu")) {
        var bookATable = db.ref("restaurant").child("book_a_menu");
        bookATable.push().set({
          menu: data.split("menu")[1],
        });
        return replyText(replyToken, "เราได้รับ order แล้ว");
      }
      return console.log(`postback: ${JSON.stringify(data)}`);

    case "beacon":
      return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken, source) {
  const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;

  switch (message.text) {
    case "ร้านค้า":
      return client.linkRichMenuToUser(
        source.userId,
        process.env.BUSINESS_RICH_MENU_ID
      );
    case "ลูกค้า":
      return client.linkRichMenuToUser(
        source.userId,
        process.env.CUSTOMER_RICH_MENU_ID
      );
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
      return console.log(`Echo message to ${replyToken}: ${message.text}`);
    // return replyText(replyToken, message.text);
  }
}

function handleBookATable(data, replyToken) {
  return client.replyMessage(replyToken, {
    type: "template",
    altText: "this is a confirm template",
    template: {
      type: "confirm",
      actions: [
        {
          type: "postback",
          label: "ใช่",
          text: "ใช่",
          data: `bookATableConfirm${data.split("bookATable")[1]}`,
        },
        {
          type: "message",
          label: "ไม่ใช่",
          text: "ไม่ใช่",
        },
      ],
      text: `คุณต้องการที่จะจองโต๊ะที่ ${data.split("bookATable")[1]}`,
    },
  });
  // return replyText(
  //   replyToken,
  //   `คุณได้จองโต๊ะที่ ${data.split("bookATable")}`
  // );
}

function handleBookATableConfirm(data, replyToken) {
  var bookATable = db.ref("restaurant").child("book_a_table");
  bookATable.push().set({
    table_book: data.split("bookATableConfirm")[1],
  });
  return replyText(
    replyToken,
    `คุณได้จองโต๊ะที่ ${data.split("bookATableConfirm")[1]}`
  );
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

module.exports = {
  handleEvent: handleEvent
}