// import { addUser } from "store/actions/user";
import { line } from "config";

const liffSDK = window.liff;
let isInit = false;
let environment = {};
let profile = {};
// let liffInfo = {};

class liff {
  init() {
    return new Promise((resolve, reject) => {
      if (!isInit) {
        liffSDK
          .init(line)
          .then(() => {
            console.log("Line", "start to use LIFF's api");
            environment = {
              browserLanguage: liffSDK.getLanguage(),
              sdkVersion: liffSDK.getVersion(),
              isInClient: liffSDK.isInClient(),
              isLoggedIn: liffSDK.isLoggedIn(),
              deviceOS: liffSDK.getOS(),
              lineVersion: liffSDK.getLineVersion(),
            };
            isInit = true
            resolve(environment);
          })
          .catch((err) => {
            console.log(
              "Line",
              "Something went wrong with LIFF initialization."
            );
            reject(
              'LIFF initialization can fail if a user clicks "Cancel" on the "Grant permission" screen, or if an error occurs in the process of liff.init()'
            );
          });
      }
    });
  }

  getLanguage() {
    return environment.browserLanguage;
  }

  getVersion() {
    return environment.getVersion;
  }

  isInClient() {
    return environment.isInClient;
  }

  isLoggedIn() {
    return environment.isLoggedIn;
  }

  getOS() {
    return environment.getOS;
  }

  getLineVersion() {
    return environment.getLineVersion;
  }

  /**
   * return AccessToken
   * Example
   * getAccessToken((token) => console.log(token))
   */
  getAccessToken() {
    return new Promise((resolve, reject) => {
      if (isInit && this.isLoggedIn) {
        resolve(liffSDK.getAccessToken());
      } else {
        reject(
          'To get an access token, you need to be logged in. Please "login" and try again.'
        );
      }
    });
  }

  async getFirebaseToken() {
    const profile = await this.getProfile()
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch('/api/createCustomToken', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: myHeaders,
      body: JSON.stringify(profile) // body data type must match "Content-Type" header
    });
    return response.json().then(data => {
      return { ...data, ...profile }
    })
  }

  login(redirectUri = null) {
    if (!this.isInClient()) {
      if (!this.isLoggedIn()) {
        liffSDK.login({ redirectUri });
      }
    }
  }

  /**
   * Return Profile
   * `{
   *  userId: '<STRING>',
   *  displayName: '<STRING>,
   *  pictureUrl: '<URL>',
   *  statusMessage: '<STRING>',
   *  email: <EMAIL>,
   *  access_token: <TOKEN>
   * }`
   */
  getProfile() {
    return new Promise((resolve, reject) => {
      if (isInit && !profile.userId) {
        liffSDK
          .getProfile()
          .then((pf) => {
            profile = {
              ...pf,
              email: liffSDK.getDecodedIDToken().email,
              access_token: liffSDK.getAccessToken(),
            };
            resolve(profile);
            // console.log("Line", profile);
          })
          .catch((err) => {
            console.log("get profile error", err);
            reject(err);
          });
      } else {
        resolve(profile);
      }
    });
  }

  closeWindow() {
    liffSDK.closeWindow();
  }

  openWindow(url, external) {
    liffSDK.openWindow({ url, external });
  }

  sendMessages(messages) {
    const messagesToSend = Array.isArray(messages) ? messages : [messages];
    return new Promise((resolve, reject) => {
      this.init()
        .then(() => {
          liffSDK
            .sendMessages(messagesToSend)
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
export default new liff();
