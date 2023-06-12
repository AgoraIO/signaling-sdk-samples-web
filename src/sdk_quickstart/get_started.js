import SignalingManager from "../SignalingManager/SignalingManager.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Signaling Manager will create the engine and channel for you
  const {
    signalingEngine,
    signalingChannel,
    login,
    logout,
    join,
    leave,
    sendPeerMessage,
    sendChannelMessage,
  } = await SignalingManager();

  // Display channel name
  document.getElementById("channelName").innerHTML = signalingChannel.channelId;

  // Buttons
  // login
  document.getElementById("login").onclick = async function () {
    await login(document.getElementById("userID").value.toString());
  };

  // logout
  document.getElementById("logout").onclick = async function () {
    await logout();
  };

  // create and join channel
  document.getElementById("join").onclick = async function () {
    await join();
  };

  // leave channel
  document.getElementById("leave").onclick = async function () {
    await leave();
  };

  // send peer-to-peer message
  document.getElementById("send_peer_message").onclick = async function () {
    await sendPeerMessage();
  };

  // send channel message
  document.getElementById("send_channel_message").onclick = async function () {
    await sendChannelMessage();
  };
};
