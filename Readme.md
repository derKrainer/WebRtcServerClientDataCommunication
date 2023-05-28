# WebRTC for Server to multi client communication

This package should make it even more easy to create a messaging channel via WebRTC by simplifying the
https://peerjs.com/ package even further.

This package is only meant to transmit data, no audio or video options are available. It's supposed to
just do the data communication.

## Install

```
npm i
npm run build
```

## Test
Open Server.html, copy the ID from the top left
Open Client.html in any other tab/browser/device, paste the ID
Type stuff in the Server.html input and see it appear on all clients

## Usage

### Server

```ts
const server = new WebRtcMessageServer(onIdAvailable: (id: string) => void);
```
constructs a new Server and when the peer ID is available, the callback will be called and the id can be
distributed to the clients.
With this ID any number of clients (not sure how many connections this can actually handle TBH) can connect via
```ts
const client = new WebRtcClient(onMessage: (data: unknown) => void;)
```
the onMessage callback provided to the client will then be invoked for every server message.

Now all that is left to use the server with:
```ts
server.send({ timestamp: Date.now(), message: 'Hello there' });
server.send('General Kenobi')
server.send(1337);
```

## Example

ServerClient.html is a test page where the first one opening it becomes the server and can share his URL
to any number of clients and then send messages to all ofd them.