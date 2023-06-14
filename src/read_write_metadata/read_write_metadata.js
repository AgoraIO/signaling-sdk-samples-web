import SignalingManagerMetadata from "./SignalingManagerMetadata.js";
//import SignalingManager from "./SignalingManagerMetadata.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => {
  const showMessage = (message) => {
    document
          .getElementById("log")
          .appendChild(document.createElement("div"))
          .append(message);
  };

  const handleSignalingEvents = (eventName, eventArgs) => {
  
    if (eventName == "MessageFromPeer") {
      
    } else if (eventName == "ConnectionStateChanged") {
      if (eventArgs.state == "CONNECTED") {
        setLocalUserMetadata();
      }
    } else if (eventName == "ChannelMessage") {
      
    } else if (eventName == "MemberJoined") {
      updateChannelMemberList();
    } else if (eventName == "MemberLeft") {
      removeUserFromList(eventArgs.memberId);
    } else if (eventName == "UserMetaDataUpdated" ) {
      const value = eventArgs.rtmMetadata.items.find(obj => obj.key === "myStatus").value;
      updateUserInList(eventArgs.uid, value == "busy");
    }
  };

  // Signaling Manager will create the engine and channel for you
  const {
    signalingEngine,
    signalingChannel,
    uid,
    login,
    logout,
    join,
    leave,
    sendPeerMessage,
    sendChannelMessage,
    setLocalUserMetadata,
    handleMetadataEvents,
    updateLocalUserMetadata,
  } = await SignalingManagerMetadata(showMessage, handleSignalingEvents);


  var isUserBusy = false; // track user status
const ul = document.getElementById("members-list");

const updateChannelMemberList = async function () {
  // Retrieve a list of users in the channel
  const members = await signalingChannel.getMembers();
  for (let i = 0; i < members.length; i++) {
    updateUserInList(members[i], false);
  }
};

const removeUserFromList = function (userID) {
  var member = ul.getElementById(userID);
  ul.removeChild(member);
}

const updateUserInList = async function (userID, busy) {
  let doesUserExist = false; // check if userID is in members list
  let userData = ""; // User data, `user ID: Busy` or `User ID: Available`
  let member;
  //var ul = document.getElementById("members-list");
  var members = ul.getElementsByTagName("li");

  for (var i = 0; i < members.length; i++) {
    if (members[i].innerHTML.includes(userID)) {
      userData = members[i].innerHTML;
      member = members[i];
      doesUserExist = true;
      break;
    }
  }

  if (doesUserExist) {
    // User already in the list, update the status
    // switch the status if needed
    if (busy && userData.includes("Available")) {
      member.innerHTML = userData.replace("Available", "Busy");
    }
    if (!busy && userData.includes("Busy")) {
      member.innerHTML = userData.replace("Busy", "Available");
    }
  } else {
    // Add a new user to the list
    // Create a li item
    const li = document.createElement("li");
    li.setAttribute("id", userID);
    li.textContent = userID + ": " + (busy ? "Busy" : "Available");
    showMessage(userID);
    ul.appendChild(li);

    // Subscribe to metadata change event for the user
    await signalingEngine.subscribeUserMetadata(userID);
  }
};



  // Display channel name
  document.getElementById("channelName").innerHTML = signalingChannel.channelId;
  // Display User name
  document.getElementById("userId").innerHTML = uid;

  // Buttons
  // login
  document.getElementById("login").onclick = async function () {
    await login();
    await handleMetadataEvents();
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

  // Change status
  document.getElementById("changeStatus").onclick = async function () {
    isUserBusy = !isUserBusy; // Switch status
    if (isUserBusy) {
      document.getElementById("statusIndicator").innerHTML = "Busy";
    } else {
      document.getElementById("statusIndicator").innerHTML = "Available";
    }

    updateLocalUserMetadata("myStatus", isUserBusy ? "busy" : "available")
    
  };

};