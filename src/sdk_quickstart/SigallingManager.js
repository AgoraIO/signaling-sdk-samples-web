import AgoraRTM from 'agora-rtm-sdk'

class SignallingManager {
  constructor(props) {
    super(props);
    // Initialize the component state with default values
    this.state = {
      appId: null,
      token: null,
      channelName: null,
      channel: null,
      signalingEngine: null,
      uid: 0,
    };
  }

  async initialize() {
    // Create an Agora RTM instance
    this.signalingEngine = AgoraRTM.createInstance(appID);
    
    // Create a channel
    this.channel = this.signalingEngine.createChannel(channelName)

    // signalingEngine Event listeners
    // Display messages from peer
    this.signalingEngine.on('MessageFromPeer', function (message, peerId) {
      console.log("New message from peerId: ", peerId)
      console.log("Message: ", message)
    })

    // Display connection state changes
    this.signalingEngine.on('ConnectionStateChanged', function (state, reason) {
      console.log("Connection state changed to: ", state)
      console.log("Reason: ", reason)
    })

    // Display channel messages
    this.channel.on('ChannelMessage', function (message, memberId) {
      console.log("Channel recieved a new message from member: ", memberId)
      console.log("Message: ", message)
    })

    // Display channel member stats
    this.channel.on('MemberJoined', function (memberId) {
      console.log("New member joined the channel with ID: ", memberId)
    })

    // Display channel member stats
    channel.on('MemberLeft', function (memberId) {
      console.log(memberId, " left the channel...")
    })
  }

  // login using the signalingEngine instance
  async login() {
    try {
      let options = {
        uid: "",
        token: "",
      }
  
      options.uid = this.state.uid
      options.token = this.state.token
      await this.signalingEngine.login(options)
    } catch (error) {
      console.error("Failed to login with error: ", error)
    }
  }

  // logout using the signalingEngine instance
  async logout() {
    try {
      await this.signalingEngine.logout()
    } catch (error) {
      console.error("Failed to logout with error: ", error)
    }
  }

  // Join channel
  async joinChannel() {
    try {
      await this.channel.join()
    } catch (error) {
      console.error("Failed to join or publish:", error);
    }
  }

  // Leave channel 
  async leaveChannel() {
    try {
      if (this.channel != null) {
        await this.channel.leave()
      } else {
        console.log("Channel is empty")
      }
    } catch (error) {
      console.error("Failed to unpublish or leave:", error);
    }
  }

  // Send Message to Peer
  async sendMessageToPeer(peerId, peerMessage) {
    try {
      await this.signalingEngine.sendMessageToPeer(
          { text: peerMessage },
          peerId,
      ).then(sendResult => {
          return sendResult.hasPeerReceived
      })
    } catch (error) {
      console.log("Error sending message to Peer: ", error)
    }
  }

  // Send message to channel
  async sendMessageToChannel(channelMessage) {
    if (this.channel != null) {
      await this.channel.sendMessage({ text: channelMessage }).then(() => {
        console.log("Message sent successfully")
      }).catch(error => {
        return error
      })
    }
  }

}

export default SignallingManager;
