import SignalingManager from "../signaling_manager/signaling_manager.js";
import showMessage from '../utils/showmessage.js';
import setupProjectSelector from "../utils/setupProjectSelector.js";

// Utility function to convert base64 string to Uint8Array
function base64ToUint8Array(base64Str) {
  const raw = window.atob(base64Str);
  const result = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) {
    result[i] = raw.charCodeAt(i);
  }
  return result;
}

// Utility function to convert hex string to ASCII string
function hex2ascii(hexx) {
  const hex = hexx.toString(); // force conversion
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

window.onload = async () => {
  // Set the project selector
  setupProjectSelector();

  // Get the config from config.json
  const config = await fetch("/signaling_manager/config.json").then((res) =>
    res.json()
  );

  // Specify the channel encryption config
  const rtmConfig = {
    token: config.token,
    logLevel: "debug",
    useStringUserId: true,
    encryptionMode: config.encryptionMode,
    salt: base64ToUint8Array(config.salt),
    cipherKey: hex2ascii(config.cipherKey),
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
