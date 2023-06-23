import SignalingManager from "../signaling_manager/signaling_manager.js";
import showMessage from '../utils/showMessage.js';
import setupProjectSelector from "../utils/setupProjectSelector.js";
import handleSignalingEvents from "../utils/handleSignalingEvents.js"

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  // Signaling Manager will create the engine and channel for you
  const {
    signalingEngine,
    config,
    login,
    logout,
    createChannel,
    join,
    leave,
    sendPeerMessage,
    sendChannelMessage,
  } = await SignalingManager(showMessage, handleSignalingEvents);

  // Display channel name
  document.getElementById("channelName").innerHTML = config.channelName;
  // Display User name
  document.getElementById("userId").innerHTML = config.uid;

  // Buttons
  // login
  document.getElementById("login").onclick = async function () {
    await login();
  };

  // logout
  document.getElementById("logout").onclick = async function () {
    await logout();
  };

  // join channel
  document.getElementById("join").onclick = async function () {
    await join();
  };

  // leave channel
  document.getElementById("leave").onclick = async function () {
    await leave();
  };

  // send peer-to-peer message
  document.getElementById("send_peer_message").onclick = async function () {
    let peerId = document.getElementById("peerId").value.toString();
    let peerMessage = document.getElementById("peerMessage").value.toString();
    await sendPeerMessage(peerId, peerMessage);
  };

  // send channel message
  document.getElementById("send_channel_message").onclick = async function () {
    let channelMessage = document
      .getElementById("channelMessage")
      .value.toString();
    await sendChannelMessage(channelMessage);
  };
};
