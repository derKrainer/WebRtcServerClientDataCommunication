// import Peer, { DataConnection } from "peerjs";
declare var Peer: any;
type DataConnection = any;

export class WebRtcMessageServer {

  private peerId: string;
  private openConnections: DataConnection[] = [];

  constructor(onIdAvailable?: (id: string) => void) {
    const peer = new Peer({ debug: 2 });
    peer.on('open', id => {
      if (id != null) {
        this.peerId = id;
        console.log('Peer open. ', { paramId: id, peerId: peer.id });
        if (onIdAvailable) {
          onIdAvailable(id);
        }
      }
    });
    peer.on('connection', this.onConnection);
    peer.on('disconnected', this.onDisconnect);
  }

  public getPeerId() {
    return this.peerId;
  }

  private onConnection = (con: DataConnection) => {
    console.log('A connection has been received. isOpen: ' + con.open);
    if (con && con.open) {
      this.openConnections.push(con);
    } else if (con) {
      const addToOpen = () => {
        console.log('Connection went to state open, adding now');
        con.off('open', addToOpen);
        this.openConnections.push(con);
      }
      con.on('open', addToOpen);
    } else {
      console.warn('Received an invalid connection', con?.open)
    }
  }

  private onDisconnect = (disco) => {
    console.error('Disconnect, TODO figure out how to identify the correct open connection to splice', disco);
  }

  public send(message: string | Object) {
    this.openConnections.forEach(con => {
      try {
        console.debug(`Sending to ${con.connectionId}:`, message);
        con.send(message);
      } catch (err) {
        console.error('Error during sending to ' + con.connectionId, err);
      }
    })
  }
}