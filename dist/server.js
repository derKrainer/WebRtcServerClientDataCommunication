/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _WebRtcServer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WebRtcServer */ "./src/WebRtcServer.ts");

window.addEventListener('load', () => {
    const server = new _WebRtcServer__WEBPACK_IMPORTED_MODULE_0__.WebRtcMessageServer(peerId => {
        document.getElementById('peerId').innerText = 'Server ID:' + peerId;
    });
    const input = document.getElementById('message');
    input.onchange = () => {
        console.log('sending ' + input.value);
        server.send({
            timestamp: Date.now(),
            message: input.value,
        });
    };
});

})();

/******/ })()
;
//# sourceMappingURL=server.js.map