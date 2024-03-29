import SignalingManagerAuthentication from "../authentication_workflow/signaling_manager_authentication.js";
import config from '../signaling_manager/config.json'

const SignalingManagerCloudProxy = async (messageCallback, eventsCallback) => {
  // Set cloud proxy
  const rtmConfig = {
    cloudProxy: config.cloudProxy,
  };

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManagerAuthentication(
    messageCallback,
    eventsCallback,
    rtmConfig
  );

  // Return the extended signaling manager
  return {
    ...signalingManager,
  };
};

export default SignalingManagerCloudProxy;
