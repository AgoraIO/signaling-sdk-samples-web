import SignalingManagerAuthentication from "../authentication_workflow/signaling_manager_authentication.js";

const SignalingManagerStreamChannel = async (
  messageCallback,
  eventsCallback
) => {
  let streamChannel = null;
  let role = "publisher"; // set the role to "publisher" or "subscriber" as appropriate

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManagerAuthentication(
    messageCallback,
    eventsCallback
  );

  const subscribeTopic = async function (isTopicSubscribed, topicName) {
    if (isTopicSubscribed){
      await signalingManager.getSignalingStreamChannel().unsubscribeTopic(topicName);
    } else {
      await signalingManager.getSignalingStreamChannel().subscribeTopic(topicName);
    }
  }

  const topicJoinAndLeave = async function (isTopicJoined, topicName) {
    if (isTopicJoined === false) {
      await signalingManager.getSignalingStreamChannel().joinTopic(topicName).then((response) => {
        messageCallback("Joined the topic: " + response.topicName);
      });
    } else {
      signalingManager.getSignalingStreamChannel().leaveTopic(topicName).then((response) => {
        console.log(response);
        messageCallback("Left the topic: " + response.topicName);
      });
    }
  }; 
   
  const sendTopicMessage = function (message, topicName) {
    if (message === "" || topicName === "") {
      console.log(
        "Make sure you specified a message and a topic to send messages"
      );
      return;
    }
    signalingManager.getSignalingStreamChannel().publishTopicMessage(topicName, message).then((response) => {
      console.log(response);
      messageCallback("Topic: " + topicName + ",  Message:" + message);
    });
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    sendTopicMessage,
    topicJoinAndLeave,
    subscribeTopic
  };
};

export default SignalingManagerStreamChannel;
