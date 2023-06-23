const handleSignalingEvents = (eventName, eventArgs) => {
  if (eventName == "MessageFromPeer") {
  } else if (eventName == "ConnectionStateChanged") {
  } else if (eventName == "ChannelMessage") {
  } else if (eventName == "MemberJoined") {
  } else if (eventName == "MemberLeft") {
  }
};

export default handleSignalingEvents;
