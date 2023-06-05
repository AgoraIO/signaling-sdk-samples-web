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
      client: null,
      uid: 0,
    };
  }

  async initialize() {
    // Create an Agora RTM instance
    this.client = AgoraRTM.createInstance(appID);
    
    // Create a channel
    this.channel = this.client.createChannel(channelName)

    // Client Event listeners
    // Display messages from peer
    this.client.on('MessageFromPeer', function (message, peerId) {
      console.log("New message from peerId: ", peerId)
      console.log("Message: ", message)
    })

    // Display connection state changes
    this.client.on('ConnectionStateChanged', function (state, reason) {
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

  // login as the client
  async login() {
    try {
      let options = {
        uid: "",
        token: "",
      }
  
      options.uid = this.state.uid
      options.token = this.state.token
      await this.client.login(options)
    } catch (error) {
      console.error("Failed to login with error: ", error)
    }
  }

  // logout as the client
  async logout() {
    try {
      await this.client.logout()
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
        await channel.leave()
      } else {
        console.log("Channel is empty")
      }
    } catch (error) {
      console.error("Failed to unpublish or leave:", error);
    }
  }

  async sendMessageToPeer(peerId, peerMessage) {
    try {
      await this.client.sendMessageToPeer(
          { text: peerMessage },
          peerId,
      ).then(sendResult => {
          return sendResult.hasPeerReceived
      })
    } catch (error) {
      console.log("Error sending message to Peer: ", error)
    }
  }
}

export default SignallingManager;
