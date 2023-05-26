import { WebRtcMessageServer } from "./WebRtcServer";

window.addEventListener('load', () => {
  const server = new WebRtcMessageServer(peerId => {
    document.getElementById('peerId').innerText = 'Server ID:' + peerId;
  });

  const input = document.getElementById('message') as HTMLInputElement;

  input.onchange = () => {
    console.log('sending ' + input.value)
    server.send({
      timestamp: Date.now(),
      message: input.value,
    });
  };
});