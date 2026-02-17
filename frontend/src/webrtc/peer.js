export const createPeerConnection = async (
  socket,
  roomId,
  localStream,
  remoteVideoRef,
  API
) => {

  const res = await fetch(`${API}/api/ice`);
  const data = await res.json();

  const pc = new RTCPeerConnection({
    iceServers: data.iceServers,
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
