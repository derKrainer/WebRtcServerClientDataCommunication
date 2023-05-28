import { WebRtcClient } from "./WebRtcClient";
import { WebRtcMessageServer } from "./WebRtcServer";

interface ServerMessage {
  timestamp: number;
  message: string;
}
const PEER_ID_PARAM = 'peerId';
const isServer = location.search === '' || !location.search.includes(PEER_ID_PARAM);

window.addEventListener('load', () => {

  if (isServer) {
    document.getElementById('clientPart').style.display = 'none';

    const server = new WebRtcMessageServer(peerId => {
      console.log('Peer is available', peerId);
      const paramSeparator = location.search === '' ? '?' : '&';
      const newLocation = location.href + `${paramSeparator}${PEER_ID_PARAM}=${peerId}`;
      history.pushState({ path: newLocation }, '', newLocation);
    });

    const input = document.getElementById('message') as HTMLInputElement;
    const sendButton = document.getElementById('sendButton') as HTMLButtonElement;

    const sendMessage = () => {
      server.send({
        timestamp: Date.now(),
        message: input.value,
      })
      console.log('Sending message: ' + input.value);
    }

    sendButton.onclick = sendMessage;
    input.onkeyup = (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        sendMessage();
      }
    };
  } else {
    // client code
    document.getElementById('serverPart').style.display = 'none';
    const container = document.getElementById('logContainer');

    function getPeerIdFromQueryParams() {
      let from = location.search.indexOf(PEER_ID_PARAM);
      if (from < 0) {
        throw 'No peer id in query params, we should be server';
      }
      from += PEER_ID_PARAM.length + 1;
      let to = location.search.indexOf('&', from)
      if (to < 0) {
        to = location.search.length;
      }
      const peerID = location.search.substring(from, to);
      console.log('Extracted peerId: ' + peerID)
      return peerID;
    }

    function createLogContainer(messages: string[]) {
      const target = document.createElement('div');
      target.classList.add('logEntry');
      target.style.display = 'flex';
      target.style.justifyContent = 'space-evenly'
      container.insertBefore(target, container.children[1]);

      messages.forEach(msg => {
        const logCell = document.createElement('div');
        logCell.innerText = msg;
        target.appendChild(logCell);
      })

      return target;
    }

    function createLog(message: ServerMessage) {
      console.log('Received message from server', message);

      const age = Date.now() - message.timestamp;
      createLogContainer([String(message.timestamp), message.message, String(age)]);
    }
    const serverPeerId = getPeerIdFromQueryParams();
    createLogContainer(['Timestamp', 'Message', 'Message delivery time']);

    const client = new WebRtcClient(createLog, () => { client.connect(serverPeerId) });
    (window as any).client = client;
  }
});