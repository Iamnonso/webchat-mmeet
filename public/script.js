const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
    host:'/',
    port: '3000'
})

const myVideo = document.createElement('video');
myVideo.muted = true;

if(navigator.mediaDevices.getUserMedia){

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((stream) => {
        addVideoStream(myVideo, stream)
    }).catch(err=>{
        console.log(err)
    })

}


socket.emit('join-room', ROOM_ID, 10)




socket.on('user-connected', userId =>{
    console.log('User connected: ' + userId);
}) 

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    });
    
    videoGrid.append(video)
}