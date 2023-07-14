import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerAuthentication = async (
  messageCallback,
  eventsCallback
) => {
  let streamChannel = null;
  let isStreamChannelJoined = false;
  let role = "publisher"; // set the role to "publisher" or "subscriber" as appropriate

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(
    messageCallback,
    eventsCallback
  );

  // Get the config
  const config = signalingManager.config;

  // Fetches the Signaling token
  async function fetchToken(uid) {
    if (config.serverUrl !== "") {
      return new Promise(function (resolve, reject) {
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
            console.log("token fetched from server: ", response.data.rtmToken);
            resolve(response.data.rtmToken);
          })
          .catch((error) => {
            console.log(error);
            resolve(config.token);
          });
      });
    } else {
      return config.token;
    }
  }

  const fetchTokenAndLogin = async (uid) => {
    const token = await fetchToken(uid);
    signalingManager.login(uid, token);
  };

  // Fetches the RTC token for stream channels
  async function fetchRTCToken(uid, channelName) {
    if (config.serverUrl !== "") {
      return new Promise(function (resolve) {
        axios
          .get(
            config.proxyUrl +
              config.serverUrl +
              "/rtc/" +
              channelName +
              "/" +
              role +
              "/uid/" +
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
            console.log("RTC token fetched from server: ", response.data.rtcToken);
            resolve(response.data.rtcToken);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    } else {
      return config.rtcToken;
    }
  }

  const streamChannelJoinAndLeave = async function (
    isStreamChannelJoined,
    streamChannelName
  ) {
    const token = await fetchRTCToken(config.uid, streamChannelName);
    streamChannel = await signalingManager
      .getSignalingEngine()
      .createStreamChannel(streamChannelName); // creates stream channel

    if (isStreamChannelJoined === false) {
      await streamChannel
        .join({
          token: token,
          withPresence: true,
        })
        .then((response) => {
          console.log(response);
        });
    } else {
      streamChannel.leave().then((response) => {
        console.log(response);
        messageCallback("left channel: " + streamChannelName);
        streamChannel = null;
      });
    }
  };

  const renewToken = async (uid) => {
    const token = await fetchToken(uid);
    const result = await signalingManager
      .getSignalingEngine()
      .renewToken(token);
    messageCallback("Token was about to expire so it was renewed...");
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    renewToken,
    fetchTokenAndLogin,
    streamChannelJoinAndLeave,
  };
};

export default SignalingManagerAuthentication;
