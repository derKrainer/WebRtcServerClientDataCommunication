import { WebRtcClient } from "./WebRtcClient";

window.addEventListener('load', () => {
  const id = document.getElementById('peerID') as HTMLInputElement;
  const log = document.getElementById('log');
  const connectButton = document.getElementById('start')
  const onMessage = data => {
    console.log(Date.now(), 'received data', data);
    let toLog = data;
    if (toLog.message != null && toLog.timestamp != null) {
      toLog = `${toLog.message} - timeDiff to server: ${Date.now() - toLog.timestamp}ms`;
    }
    log.textContent += toLog + '\n';
  }

  const client = new WebRtcClient(onMessage)
  connectButton.onclick = () => {
    client.connect(id.value);
  }
})