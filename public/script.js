const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer({port: 443, path: '/'});


const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {}

if(navigator.mediaDevices.getUserMedia){

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((stream) => {
        addVideoStream(myVideo, stream)

        myPeer.on('call', call => {
            call.answer(stream);
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
              addVideoStream(video, userVideoStream)
            })
          },
          function(err){
            console.log("Failed to get local stream", err);
          }
          );
        
          socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
          })
    }).catch(err=>{
        console.log(err)
    })

}


myPeer.on('open', id=>{

    socket.emit('join-room', ROOM_ID, id)
    console.log('emitting event here...');

})


function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    console.log('New user call ', + call);
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log('UserVideoStream ', + userVideoStream);
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  
    peers[userId] = call
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    });
    
    videoGrid.append(video);

    let totalUsers = document.getElementsByTagName("video").length;
  if (totalUsers > 1) {
    for (let index = 0; index < totalUsers; index++) {
      document.getElementsByTagName("video")[index].style.width =
        100 / totalUsers + "%";
    }
  }
}