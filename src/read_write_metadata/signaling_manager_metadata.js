import SignalingManager from '../signaling_manager/signaling_manager.js';

const SignalingManagerMetadata = async (messageCallback, eventsCallback) => {
  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(messageCallback, eventsCallback);

  const handleMetadataEvents = async function () {
    signalingManager.signalingEngine.on("UserMetaDataUpdated", function (uid, rtmMetadata) {
      if (typeof rtmMetadata !== "undefined") {
        const eventArgs = { uid: uid, rtmMetadata: rtmMetadata }
        eventsCallback("UserMetaDataUpdated", eventArgs)
      }
    });   
  }

  const setLocalUserMetadata = async function () {
    // Clear previous metadata
    try {
      await signalingManager.signalingEngine.clearLocalUserMetadata();
    } catch (status) {
      if (status) {
        const { code, message } = status;
        console.log(code, message);
      }
    }
    // Set local user metadata
    const item1 = signalingManager.signalingEngine.createMetadataItem();
    item1.setKey("myStatus");
    item1.setValue("available");

    try {
      await signalingManager.signalingEngine.setLocalUserMetadata([item1]);
    } catch (status) {
      if (status) {
        const { code, message } = status;
        messageCallback(code + ": " +  message);
      }
    }
  };

  const updateLocalUserMetadata = async function (key, value) {
    const metadataItem  = signalingManager.signalingEngine.createMetadataItem();
    metadataItem.setKey(key);
    metadataItem.setValue(value);

    try {
      await signalingManager.signalingEngine.updateLocalUserMetadata([metadataItem]);
    } catch (status) {
      if (status) {
        const { code, message } = status;
        messageCallback("Error:" + code + ": " + message);
      }
    }
  };
  

  // Return the extended signaling manager
  return {
    ...signalingManager,
    setLocalUserMetadata,
    handleMetadataEvents,
    updateLocalUserMetadata,
  };
};

export default SignalingManagerMetadata;
