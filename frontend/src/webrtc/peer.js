export const createPeerConnection = (socket, roomId, localStream, remoteVideoRef) => {
 const pc = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject"
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject"
    }
  ]
});


  localStream.getTracks().forEach(track =>
    pc.addTrack(track, localStream)
  );

 pc.ontrack = (event) => {
  remoteVideoRef.current.srcObject = event.streams[0];
};


  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        roomId,
        candidate: event.candidate,
      });
    }
  };

  return pc;
};
