export const createPeerConnection = async (
  socket,
  roomId,
  localStream,
  remoteVideoRef,
  API
) => {

  console.log("Fetching ICE servers...");

  const res = await fetch(`${API}/api/ice`);
  const data = await res.json();

  console.log("ICE Servers received:", data.iceServers);

  const pc = new RTCPeerConnection({
    iceServers: data.iceServers,
  });

  pc.oniceconnectionstatechange = () => {
    console.log("ICE State:", pc.iceConnectionState);
  };

  pc.onconnectionstatechange = () => {
    console.log("Peer State:", pc.connectionState);
  };

  localStream.getTracks().forEach(track =>
    pc.addTrack(track, localStream)
  );

 pc.ontrack = (event) => {
  console.log("Remote stream received!");

  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = event.streams[0];

    remoteVideoRef.current.play().catch((err) => {
      console.log("Autoplay prevented:", err);
    });
  }
};


  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("Sending ICE candidate");
      socket.emit("ice-candidate", {
        roomId,
        candidate: event.candidate,
      });
    }
  };

  return pc;
};
