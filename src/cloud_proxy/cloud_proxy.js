import SignalingManager from "../signaling_manager/signaling_manager.js";
import showMessage from '../utils/showmessage.js';
import setupProjectSelector from "../utils/setupProjectSelector.js";

window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  // Fetch the signaling configuration from a JSON file
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  const rtmConfig = {
    logLevel: "debug",
    useStringUserId: true,
    cloudProxy: true
  };
  
  // Signaling Manager will create the engine and channel for you
  const {
    signalingEngine,
    login,
    logout,
    join,
    leave,
    sendChannelMessage,
  } = await SignalingManager(showMessage, rtmConfig);

  // Display channel name
  document.getElementById("channelName").innerHTML = config.channelName;

  // Display User name
  document.getElementById("userId").innerHTML = config.uid;

  // Buttons
  const loginButton = document.getElementById("login");
  loginButton.addEventListener("click", async () => {
    await login();
  });

  const logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", async () => {
    await logout();
  });

  const joinButton = document.getElementById("join");
  joinButton.addEventListener("click", async () => {
    await join(config.channelName);
  });

  const leaveButton = document.getElementById("leave");
  leaveButton.addEventListener("click", async () => {
    await leave(config.channelName);
  });

  const sendChannelMessageButton = document.getElementById("send_channel_message");
  sendChannelMessageButton.addEventListener("click", async () => {
    // Get the channel message from the input field
    const channelMessage = document.getElementById("channelMessage").value.toString();
    await sendChannelMessage(config.channelName, channelMessage);
  });
};
