const SignalingManager = async (messageCallback, eventsCallback) => {
  let signalingEngine = null;
  let signalingChannel = null;

  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Setup the signaling engine and channel
  const setupSignalingEngine = async () => {
    // Create an Agora RTM instance
    signalingEngine = AgoraRTM.createInstance(config.appId);

    // signalingEngine Event listeners
    // Display messages from peer
    signalingEngine.on("MessageFromPeer", function (message, peerId) {
      const eventArgs = { message: message, peerId: peerId };
      eventsCallback("MessageFromPeer", eventArgs);
      messageCallback(
        "Received peer message from " + peerId + ": " + message.text
      );
    });

    // Display connection state changes
    signalingEngine.on("ConnectionStateChanged", function (state, reason) {
      const eventArgs = { state: state, reason: reason };
      eventsCallback("ConnectionStateChanged", eventArgs);
      messageCallback(
        "Connection state changed to: " + state + ", Reason: " + reason
      );
    });
  };

  await setupSignalingEngine();

  const login = async (uid, token) => {
    const loginParams = {
      uid: uid || config.uid,
      token: token || config.token,
    };
    signalingEngine.login(loginParams);
  };

  const logout = async () => {
    signalingEngine.logout();
  };

  const getSignalingChannel = () => {
    return signalingChannel;
  }

  const createChannel = (channelName) => {
    // Create a signalingChannel
    channelName = channelName || config.channelName;
    signalingChannel = signalingEngine.createChannel(channelName);

    // Display signalingChannel messages
    signalingChannel.on("ChannelMessage", function (message, memberId) {
      const eventArgs = { message: message, memberId: memberId };
      eventsCallback("ChannelMessage", eventArgs);
      messageCallback(
        "Received channel message from " + memberId + ": " + message.text
      );
    });

    // Display signalingChannel member stats
    signalingChannel.on("MemberJoined", function (memberId) {
      const eventArgs = { memberId: memberId };
      eventsCallback("MemberJoined", eventArgs);
      messageCallback(memberId + " joined the channel");
    });

    // Display signalingChannel member stats
    signalingChannel.on("MemberLeft", function (memberId) {
      const eventArgs = { memberId: memberId };
      eventsCallback("MemberLeft", eventArgs);
      messageCallback(memberId + " left the channel");
    });
  };

  const join = async (channelName) => {
    if (signalingChannel == null) {
      createChannel(channelName);
    }

    // Join
    await signalingChannel.join().then(() => {
      messageCallback(
        "You have successfully joined channel " + signalingChannel.channelId
      );
      const eventArgs = { channelId: signalingChannel.channelId };
      eventsCallback("JoinedChannel", eventArgs);
    });
  };

  const leave = async () => {
    if (signalingChannel != null) {
      await signalingChannel.leave().then(() => {
        messageCallback(
          "You have successfully left channel " + signalingChannel.channelId
        );
        const eventArgs = { channelId: signalingChannel.channelId };
        eventsCallback("LeftChannel", eventArgs);
      });
    } else {
      messageCallback("Channel is null");
    }
  };

  const sendPeerMessage = async (peerId, peerMessage) => {
    await signalingEngine
      .sendMessageToPeer({ text: peerMessage }, peerId)
      .then((sendResult) => {
        if (sendResult.hasPeerReceived) {
          messageCallback("Message received by " + peerId + ": " + peerMessage);
        } else {
          messageCallback("Message sent to: " + peerId + ": " + peerMessage);
        }
      });
  };

  const sendChannelMessage = async (channelMessage) => {
    if (signalingChannel != null) {
      await signalingChannel.sendMessage({ text: channelMessage }).then(() => {
        messageCallback(
          "Channel message from " +
            signalingChannel.channelId +
            ": " +
            channelMessage
        );
      });
    }
  };

  return {
    signalingEngine,
    config,
    getSignalingChannel,
    login,
    logout,
    join,
    leave,
    sendPeerMessage,
    sendChannelMessage,
  };
};

export default SignalingManager;
