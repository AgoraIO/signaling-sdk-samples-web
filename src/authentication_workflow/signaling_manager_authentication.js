import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerAuthentication = async (
  messageCallback,
  eventsCallback
) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(
    messageCallback,
    eventsCallback
  );

  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Fetches the Signaling token
  async function FetchToken(uid) {
    if (config.serverUrl !== "") {
      return new Promise(function (resolve) {
        axios
          .get(
            config.proxyUrl +
              config.serverUrl +
              "/rtm/" +
              uid +
              "/?expiry=" +
              config.tokenExpiryTime,
            {
              headers: {
                "X-Requested-With": "XMLHttpRequest",
              },
            }
          )
          .then((response) => {
            resolve(response.data.rtmToken);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      return config.token;
    }
  }

  const fetchTokenAndLogin = async (uid) => {
    const token = await FetchToken(uid);
    signalingManager.login(uid, token);
  };

  const handleTokenExpiry = async () => {
    // Event triggers when token is about to expire in 30 seconds
    signalingManager.signalingEngine.on(
      "TokenPrivilegeWillExpire",
      async function () {
        const token = await FetchToken();
        signalingManager.signalingEngine.renewToken(token);
        console.log("token renewed...");
      }
    );
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    handleTokenExpiry,
    fetchTokenAndLogin,
  };
};

export default SignalingManagerAuthentication;
