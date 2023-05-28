/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/WebRtcClient.ts":
/*!*****************************!*\
  !*** ./src/WebRtcClient.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebRtcClient: () => (/* binding */ WebRtcClient)
/* harmony export */ });
class WebRtcClient {
    constructor(onMessage, onPeerOpen = (peerId) => { }) {
        this.onMessage = onMessage;
        this.onPeerOpen = onPeerOpen;
        this.peer = new Peer({ debug: 2 });
        this.initPeer();
    }
    initPeer() {
        this.peer.on('open', (id) => {
            // Workaround for peer.reconnect deleting previous id
            if (this.peer.id === null) {
                console.log('Received null id from peer open');
            }
            else {
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
    connect(targetPeerId) {
        this.lastTargetPeerId = targetPeerId;
        if (this.connection) {
            console.log('closing previous connection');
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


/***/ }),

/***/ "./src/WebRtcServer.ts":
/*!*****************************!*\
  !*** ./src/WebRtcServer.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebRtcMessageServer: () => (/* binding */ WebRtcMessageServer)
/* harmony export */ });
class WebRtcMessageServer {
    constructor(onIdAvailable) {
        this.openConnections = [];
        this.onConnection = (con) => {
            console.log('A connection has been received. isOpen: ' + con.open);
            if (con && con.open) {
                this.openConnections.push(con);
            }
            else if (con) {
                const addToOpen = () => {
                    console.log('Connection went to state open, adding now');
                    con.off('open', addToOpen);
                    this.openConnections.push(con);
                };
                con.on('open', addToOpen);
            }
            else {
                console.warn('Received an invalid connection', con?.open);
            }
        };
        this.onDisconnect = (disco) => {
            console.error('Disconnect, TODO figure out how to identify the correct open connection to splice', disco);
        };
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
    getPeerId() {
        return this.peerId;
    }
    send(message) {
        this.openConnections.forEach(con => {
            try {
                console.debug(`Sending to ${con.connectionId}:`, message);
                con.send(message);
            }
            catch (err) {
                console.error('Error during sending to ' + con.connectionId, err);
            }
        });
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/serverClient.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _WebRtcClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WebRtcClient */ "./src/WebRtcClient.ts");
/* harmony import */ var _WebRtcServer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WebRtcServer */ "./src/WebRtcServer.ts");


const PEER_ID_PARAM = 'peerId';
const isServer = location.search === '' || !location.search.includes(PEER_ID_PARAM);
window.addEventListener('load', () => {
    if (isServer) {
        document.getElementById('clientPart').style.display = 'none';
        const server = new _WebRtcServer__WEBPACK_IMPORTED_MODULE_1__.WebRtcMessageServer(peerId => {
            console.log('Peer is available', peerId);
            const paramSeparator = location.search === '' ? '?' : '&';
            const newLocation = location.href + `${paramSeparator}${PEER_ID_PARAM}=${peerId}`;
            history.pushState({ path: newLocation }, '', newLocation);
        });
        const input = document.getElementById('message');
        const sendButton = document.getElementById('sendButton');
        const sendMessage = () => {
            server.send({
                timestamp: Date.now(),
                message: input.value,
            });
            console.log('Sending message: ' + input.value);
        };
        sendButton.onclick = sendMessage;
        input.onkeyup = (keyEvent) => {
            if (keyEvent.key === 'Enter') {
                sendMessage();
            }
        };
    }
    else {
        // client code
        document.getElementById('serverPart').style.display = 'none';
        const container = document.getElementById('logContainer');
        function getPeerIdFromQueryParams() {
            let from = location.search.indexOf(PEER_ID_PARAM);
            if (from < 0) {
                throw 'No peer id in query params, we should be server';
            }
            from += PEER_ID_PARAM.length + 1;
            let to = location.search.indexOf('&', from);
            if (to < 0) {
                to = location.search.length;
            }
            const peerID = location.search.substring(from, to);
            console.log('Extracted peerId: ' + peerID);
            return peerID;
        }
        function createLogContainer(messages) {
            const target = document.createElement('div');
            target.classList.add('logEntry');
            target.style.display = 'flex';
            target.style.justifyContent = 'space-evenly';
            container.insertBefore(target, container.children[1]);
            messages.forEach(msg => {
                const logCell = document.createElement('div');
                logCell.innerText = msg;
                logCell.style.textAlign = 'center';
                target.appendChild(logCell);
            });
            return target;
        }
        function createLog(message) {
            console.log('Received message from server', message);
            const age = Date.now() - message.timestamp;
            createLogContainer([String(message.timestamp), message.message, String(age)]);
        }
        const serverPeerId = getPeerIdFromQueryParams();
        createLogContainer(['Timestamp', 'Message', 'Message delivery time']);
        const client = new _WebRtcClient__WEBPACK_IMPORTED_MODULE_0__.WebRtcClient(createLog, () => { client.connect(serverPeerId); });
        window.client = client;
    }
});

})();

/******/ })()
;
//# sourceMappingURL=clientServer.js.map