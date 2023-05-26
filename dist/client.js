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
    constructor(onMessage) {
        this.onMessage = onMessage;
        this.peer = new Peer({ debug: 2 });
        this.initPeer();
    }
    initPeer() {
        this.peer.on('open', (id) => {
            // Workaround for peer.reconnect deleting previous id
            if (this.peer.id === null) {
                console.log('Received null id from peer open');
            }
            console.log('ID: ' + this.peer.id);
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
/*!***********************!*\
  !*** ./src/client.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _WebRtcClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WebRtcClient */ "./src/WebRtcClient.ts");

window.addEventListener('load', () => {
    const id = document.getElementById('peerID');
    const log = document.getElementById('log');
    const connectButton = document.getElementById('start');
    const onMessage = data => {
        console.log(Date.now(), 'received data', data);
        let toLog = data;
        if (toLog.message != null && toLog.timestamp != null) {
            toLog = `${toLog.message} - timeDiff to server: ${Date.now() - toLog.timestamp}ms`;
        }
        log.textContent += toLog + '\n';
    };
    const client = new _WebRtcClient__WEBPACK_IMPORTED_MODULE_0__.WebRtcClient(onMessage);
    connectButton.onclick = () => {
        client.connect(id.value);
    };
});

})();

/******/ })()
;
//# sourceMappingURL=client.js.map