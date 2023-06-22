import SignalingManager from "../signaling_manager/signaling_manager.js";
import showMessage from '../utils/showmessage.js';
import setupProjectSelector from "../utils/setupProjectSelector.js";

// The following code is solely related to UI implementation and not Agora-specific code
window.onload = async () => 
{
    let streamChannel = null;
    let streamChannelName = "demoChannel";
    let selectedTopic = "";
    let topicList = [];
    let isJoinStreamChannel = false;
    
    // Set the project selector
    setupProjectSelector();
    
    // Signaling Manager will create the engine and channel for you
    const 
    {
        signalingEngine,
        login,
        logout,
        config
    } = await SignalingManager(showMessage);
    
    signalingEngine.addEventListener(
    {
        topic: (topicEvent) =>
        {
            // Clear existing options
            dropdown.innerHTML = '';
            // Create and append new options
            messageCallback("Topic Details: " + topicEvent.topicInfos);
            messageCallback("The channel name for which the event was triggered :" + topicEvent.channelName);
            messageCallback("The publisher is : "+ topicEvent.publisher);
            messageCallback("The number of topic in the channel" + topicEvent.totalTopics);
        },
        presence: (presenceData) =>
        {
            switch (presenceData.eventType ) {
                case 'REMOTE_JOIN':
                    console.log('A remote user joined the channel');
                    console.log(presenceData);
                  break;
                case 'REMOTE_LEAVE':
                    console.log('A remote user left the channel');
                    console.log(presenceData);
                  break;
                case 'REMOTE_TIMEOUT':
                    console.log('A remote user connection timeout')
                    console.log(presenceData);
                  break;
                case 'REMOTE_STATE_CHANGED':
                    console.log('A remote user connection state changed')
                    console.log(presenceData);
                  break;
                case 'ERROR_OUT_OF_SERVICE':
                    console.log('A use joined the channel without presence');
                    console.log(presenceData);
                  break;
                default:
                  // Code to be executed if the expression doesn't match any case
                  break;
              }
        }
    });

    // Display User name
    document.getElementById("userId").innerHTML = config.uid;
    document.getElementById('streamChannelNameLbl').innerHTML = "Stream channel name is: <b>" + streamChannelName + "</b>";

    // Buttons
    const loginButton = document.getElementById("login");
    loginButton.addEventListener("click", async () => 
    {
        await login();
    });
    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", async () => 
    {
        await logout();
    });
    document.getElementById("streamJoinAndLeave").onclick = async function () 
    {
        if(config.rtcToken === null)
        {
            console.log("please create a rtc token from the console and add the token to the RtcToken variable in 'stream_channel/stream_channel.js'");
            return;
        }
        if(isJoinStreamChannel === false)
        {
            streamChannel = signalingEngine.createStreamChannel(streamChannelName);
            streamChannel.join(
                {
                    token: config.RtcToken,
                    withPresence: true,
                }).then((response) =>
                {
                    isJoinStreamChannel = true;
                    console.log(response);
                    document.getElementById('streamJoinLeave').innerHTML = "Leave";
                });
        }
        else
        {
            streamChannel.leave().then((response) =>
            {
                showMessage("left channel: " + streamChannelName);
                isJoinStreamChannel = false;
                document.getElementById('streamJoinLeave').innerHTML = "Join";
                streamChannel = null;
            });  
        }
    }
    document.getElementById('sendTopicMessage').onclick = async function ()
    {
        let topicName = document.getElementById('topicName').innerHTML;
        let message = document.getElementById('topicMessage').textContent;
        if(message === "" || topicName === "")
        {
            console.log("Make sure you specified a message and a topic to send messages");
            return;
        }
        streamChannel.publishTopicMessage(selectedTopic, message ,{customType: string}).then((response) =>
        {
            showMessage("Topic: " + selectedTopic + ",  Message:" + message);
        });
    }
};
