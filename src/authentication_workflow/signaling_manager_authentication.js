import SignalingManager from "../signaling_manager/signaling_manager.js";

const SignalingManagerAuthentication = async (
  messageCallback,
  eventsCallback
) => {
  let streamChannel = null;
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
      try {
        const res = await fetch(config.proxyUrl +
          config.serverUrl +
          "/rtm/" +
          uid +
          "/?expiry=" +
          config.tokenExpiryTime, {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        })
        const data = await res.text();
        console.log(data);
        const json = await JSON.parse(data);
        return json.rtmToken;
      } catch (err) {
        console.log(err);
      }
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
      try {
        const res = await fetch(config.proxyUrl +
          config.serverUrl +
          "/rtc/" +
          channelName +
          "/" +
          role +
          "/uid/" +
          uid +
          "/?expiry=" +
          config.tokenExpiryTime, {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        })
        const data = await res.text();
        console.log(data);
        const json = await JSON.parse(data);
        return json.rtmToken;
      } catch (err) {
        console.log(err);
      }
    } else {
      return config.rtcToken;
    }
  }

  const streamChannelJoinAndLeave = async function (
    isStreamChannelJoined,
    uid,
    streamChannelName
  ) {
    const token = await fetchRTCToken(uid, streamChannelName);
    if (getSignalingStreamChannel() === null) {
      streamChannel = await signalingManager
        .getSignalingEngine()
        .createStreamChannel(streamChannelName); // creates stream channel
    }

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

  const getSignalingStreamChannel = () => {
    console.log("this is sc", streamChannel);
    return streamChannel;
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
    getSignalingStreamChannel,
  };
};

export default SignalingManagerAuthentication;
