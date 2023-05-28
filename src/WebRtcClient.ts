// import Peer, { DataConnection } from "peerjs";
declare type Peer = any;
declare var Peer: Peer;
type DataConnection = any;

export class WebRtcClient {
  private connection: DataConnection;
  private peer: Peer;
  private lastTargetPeerId: string;

  constructor(private onMessage: (data: unknown) => void, private onPeerOpen = (peerId: string) => { }) {
    this.peer = new Peer({ debug: 2 });
    this.initPeer();
  }

  initPeer() {
    this.peer.on('open', (id) => {
      // Workaround for peer.reconnect deleting previous id
      if (this.peer.id === null) {
        console.log('Received null id from peer open');
      } else {
        console.log('ID: ' + this.peer.id);
      }
      this.onPeerOpen(this.peer.id);
    });
    this.peer.on('connection', (c) => {
      // Disallow incoming connections
      c.on('open', function () {
        c.send("Sender does not accept incoming connections");
        setTimeout(function () { c.close(); }, 500);
      });
    });
    this.peer.on('disconnected', () => {
      console.warn("Connection lost. Please reconnect");
      this.peer.connect(this.lastTargetPeerId);
    });
  }

  connect(targetPeerId: string) {
    this.lastTargetPeerId = targetPeerId;
    if (this.connection) {
      console.log('closing previous connection')
      this.connection.close();
    }
    console.log('connecting to ' + targetPeerId);
    this.connection = this.peer.connect(targetPeerId, { reliable: true });
    this.connection.on('open', () => {
      console.log("Connected to: " + this.connection.peer);
    });
    this.connection.on('data', this.onMessage);
  }

  destroy() {
    this.connection.close();
    this.peer.destroy();
  }
}