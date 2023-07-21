import AgoraRTM from "agora-rtm"

const SignalingManager = async (messageCallback, eventsCallback, rtmConfig) => {
  let signalingEngine = null;
  let signalingChannel = null;

  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Set up the signaling engine with the provided App ID, UID, and configuration
  const setupSignalingEngine = async (rtmConfig) => {
    try {
      rtmConfig = rtmConfig || {
        token: config.token,
        useStringUserId: config.useStringUserId,
        logUpload: config.logUpload,
        presenceTimeout: config.presenceTimeout,
      };
      signalingEngine = new AgoraRTM.RTM(config.appId, config.uid, rtmConfig);
    } catch (error) {
      console.log("Error:", error);
    }

    // Event listener to handle incoming messages and connection status changes
    signalingEngine.addEventListener({
      // Message event handler
      message: (eventArgs) => {
        eventsCallback("message", eventArgs);
        messageCallback(
          "Received message from " +
            eventArgs.publisher +
            ": " +
            eventArgs.message
        );
      },
      // State event handler
      status: (eventArgs) => {
        eventsCallback("status", eventArgs);
        messageCallback(
          "Connection state changed to: " +
            eventArgs.state +
            ", Reason: " +
            eventArgs.reason
        );
      },
      // Presence event handler.
      presence: (eventArgs) => {
        eventsCallback("presence", eventArgs);
        if (eventArgs.eventType === "SNAPSHOT") {
          messageCallback(
            `User ${eventArgs.snapshot[0].userId} joined channel ${eventArgs.channelName}`
          );
        } else {
          messageCallback(
            "Presence event: " +
              eventArgs.eventType +
              ", User: " +
              eventArgs.publisher
          );
        }
      },
      // Storage event handler
      storage: (eventArgs) => {
        eventsCallback("storage", eventArgs);
      },
      // Topic event handler
      topic: (eventArgs) => {
        eventsCallback("topic", eventArgs);
      },
      // Lock event handler
      lock: (eventArgs) => {
        eventsCallback("lock", eventArgs);
      },
      // TokenPrivilegeWillExpire event handler
      TokenPrivilegeWillExpire: (eventArgs) => {
        eventsCallback("TokenPrivilegeWillExpire ", eventArgs);
      },
    });
  };

  // Login to the signaling engine
  const login = async (uid, token) => {
    try {
      if (uid !== undefined) config.uid = uid;
      if (token !== undefined) config.token = token;

      await setupSignalingEngine(rtmConfig);
      const result = await signalingEngine.login();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getSignalingEngine = () => {
    return signalingEngine;
  };

  // Logout from the signaling engine
  const logout = async () => {
    await signalingEngine.logout();
  };

  const createChannel = async (channelName) => {
    // Create a signalingChannel
    channelName = channelName || config.channelName;
    try {
      signalingChannel = await signalingEngine.createStreamChannel(channelName);
    } catch (error) {
      console.error(error);
    }
  };

  // Subscribe to a channel
  const subscribe = async (channelName) => {
    channelName = channelName || config.channelName;
    try {
      const subscribeOptions = {
        withMessage: true,
        withPresence: true,
        withMetadata: true,
        withLock: true,
      };
      await signalingEngine.subscribe(channelName, subscribeOptions);
    } catch (error) {
      console.log(error);
    }
  };

  // Unsubscribe a channel
  const unsubscribe = async (channelName) => {
    channelName = channelName || config.channelName;
    try {
      await signalingEngine.unsubscribe(channelName);
      messageCallback("You have successfully left channel " + channelName);
    } catch (error) {
      console.log(error);
    }
  };

  // Send a message to a channel
  const sendChannelMessage = async (channelName, Message) => {
    const payload = { type: "text", message: Message };
    const publishMessage = JSON.stringify(payload);
    try {
      const sendResult = await signalingEngine.publish(
        channelName,
        publishMessage
      );
      messageCallback(`Message sent to channel ${channelName}: ${Message}`);
    } catch (error) {
      console.log(error);
    }
  };

  // Return the signaling engine and the available functions
  return {
    getSignalingEngine,
    config,
    login,
    logout,
    createChannel,
    subscribe,
    unsubscribe,
    sendChannelMessage,
  };
};

export default SignalingManager;
