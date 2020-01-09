// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/libs/oxo.js":[function(require,module,exports) {
window.oxo = {
  oxo: this,
  width: window.innerWidth,
  height: window.innerHeight,
  animation: {
    /**
     * Modify the transform property of an element to make it move
     * @param {HTMLElement} element - The element to move
     * @param {string} direction - The direction
     * @param {number} distance - The number of pixels for the move
     * @param {allowOutside} boolean - If true, the element can go off limits
     * @return {Object} - An object containing the updated position x and y
     */
    move: function move(element, direction, distance, allowOutside) {
      if (!element) {
        console.error('The element to move was not found');
        return;
      }

      if (!distance) {
        console.error('You must provide a distance to move an element');
        return;
      }

      var position = oxo.animation.getPosition(element);
      var newPosition = oxo.animation.computeNewPosition(position, direction, distance);
      var elPos = element.getBoundingClientRect();

      if (!allowOutside) {
        if (newPosition.x + elPos.width > oxo.width || newPosition.x < 0 || newPosition.y + elPos.height > oxo.height || newPosition.y < 0) {
          return;
        }
      }

      if (oxo.elements.obstacles.length) {
        var elFuturePos = Object.assign(elPos, {
          x: newPosition.x,
          y: newPosition.y
        });

        if (!oxo.elements.obstacles.every(function (obstacle) {
          return obstacle == element || !oxo.elements.elementsAreColliding(obstacle.getBoundingClientRect(), elFuturePos);
        })) {
          return;
        }
      }

      oxo.animation.setPosition(element, newPosition);
      return newPosition;
    },

    /**
     * Modify a position object depending on direction and distance
     * @param {Object} position - An object containing the x and y position
     * @param {string} direction - The direction in which to move
     * @param {number} distance - The distance to move
     */
    computeNewPosition: function computeNewPosition(position, direction, distance) {
      var newPosition = Object.assign({}, position);

      switch (direction) {
        case 'left':
          newPosition.x -= distance;
          break;

        case 'left-up':
          newPosition.y -= distance;
          newPosition.x -= distance;
          break;

        case 'up':
          newPosition.y -= distance;
          break;

        case 'right-up':
          newPosition.y -= distance;
          newPosition.x += distance;
          break;

        case 'right':
          newPosition.x += distance;
          break;

        case 'right-down':
          newPosition.x += distance;
          newPosition.y += distance;
          break;

        case 'down':
          newPosition.y += distance;
          break;

        case 'left-down':
          newPosition.y += distance;
          newPosition.x -= distance;
          break;

        default:
          console.error('The direction provided (' + direction + ') is not valid');
          return;
      }

      return newPosition;
    },

    /**
     * Get the values of the translate property for the given element
     * @param {HTMLElement} element - The element
     * @return {Object} An object containing the x and the y position
     */
    getPosition: function getPosition(element) {
      var position = element.style.transform.match(new RegExp(/translate\(.+\)/));

      if (position) {
        var values = position[0].match(/-?\d+/g).map(function (value) {
          return parseInt(value);
        });
        return {
          x: values[0],
          y: values[1]
        };
      } else {
        return {
          x: 0,
          y: 0
        };
      }
    },

    /**
     * Set the translate property of the given element
     * @param {HTMLElement} element - The element to move
     * @param {Object} position - An object containing the x and y values
     * @return {string} - The updated transform property
     */
    setPosition: function setPosition(element, position) {
      var transform = element.style.transform.replace(/translate\(.+\)/, '');
      var translation = 'translate(' + position.x + 'px, ' + position.y + 'px)';
      return element.style.transform = transform + translation;
    },

    /**
     * Search for an element that can be moved and call the adequate function
     * @return {HTMLElement} the element moved
     */
    getMovableElement: function getMovableElement() {
      var movableElement = document.querySelector('[data-oxo-movable]');

      if (movableElement) {
        var speed = movableElement.getAttribute('data-oxo-speed');
        speed = speed ? speed : 10;
        oxo.animation.moveElementWithArrowKeys(movableElement, speed);
        return movableElement;
      }
    },

    /**
     * Move an element when the user press the arrow keys
     * @param {HTMLElement} element - The element to move
     * @param {number} speed - The speed of the movement
     */
    moveElementWithArrowKeys: function moveElementWithArrowKeys(element, speed) {
      var interval;
      var pressed = [];
      var pixels = speed > 100 ? Math.round(speed / 100) : 1;
      document.addEventListener('keydown', function (event) {
        if (event.key.indexOf('Arrow') === 0) {
          var direction = event.key.replace('Arrow', '').toLowerCase();

          if (pressed.indexOf(direction) === -1) {
            pressed.push(direction);

            if (!interval) {
              interval = setInterval(function () {
                window.requestAnimationFrame(function () {
                  if (pressed.length) {
                    oxo.animation.move(element, oxo.inputs.getDirectionFromPressedKeys(pressed), pixels, false);
                  }
                });
              }, 100 / speed);
            }
          }
        }
      });
      document.addEventListener('keyup', function (event) {
        if (event.key.indexOf('Arrow') === 0) {
          var direction = event.key.replace('Arrow', '').toLowerCase();
          pressed = pressed.filter(function (key) {
            return key !== direction;
          });

          if (!pressed.length) {
            clearInterval(interval);
            interval = null;
          }
        }
      });
    }
  },
  elements: {
    obstacles: [],

    /**
     * Create an HTML element
     * @param {*} params - An object containing the element parameters
     * @return {HTMLElement} The created element
     */
    createElement: function createElement(params) {
      var element = document.createElement(params.type ? params.type : 'div');

      if (params.class) {
        params.class.split(' ').forEach(function (className) {
          element.classList.add(className);
        });
      }

      if (params.styles) {
        for (style in params.styles) {
          element.style[style] = params.styles[style];
        }
      }

      if (params.obstacle) {
        oxo.elements.obstacles.push(element);
      }

      oxo.elements.appendElement(element, params.appendTo);
      return element;
    },

    /**
     * Append an element inside another one
     * @param {HTMLElement} element - The element to append
     * @param {string} hostSelector - The string to select the host element
     */
    appendElement: function appendElement(element, hostSelector) {
      var host = hostSelector ? document.querySelector(hostSelector) : document.body;

      if (!host) {
        console.error('No element was found for selector ', +hostSelector);
        return;
      }

      host.appendChild(element);
    },

    /**
     * Execute an action when the given element collides with the border
     * @param {HTMLElement} element - The element to observe
     * @param {Function} action - The action to execute
     * @param {boolean} completly - If true, the whole element must be outside
     * @param {boolean} once - If true, the action will be executed only once
     * @return {IntersectionObserver} - The observer
     */
    onLeaveScreen: function onLeaveScreen(element, action, completly, once) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            action();

            if (once) {
              observer.disconnect();
            }
          }
        });
      }, {
        root: null,
        rootMargin: '0px',
        threshold: completly ? 0 : 1
      });
      observer.observe(element);
      return observer;
    },

    /**
     * Execute an action once the given element collides with the border
     * @param {HTMLElement} element - The element to observe
     * @param {Function} action - The action to execute
     * @param {boolean} completly - If true, the whole element must be outside
     * @return {IntersectionObserver} - The observer
     */
    onLeaveScreenOnce: function onLeaveScreenOnce(element, action, completly) {
      return oxo.elements.onLeaveScreen(element, action, completly, true);
    },

    /**
     * Execute an action when two element collides
     * @param {HTMLElement} element - The element to observe
     * @param {HTMLElement} target - The element to collide with
     * @param {Function} action - The action to execute
     * @param {boolean} once - If true, the action is executed only once
     * @return {Interval} - The timer used for checking
     */
    onCollisionWithElement: function onCollisionWithElement(element, target, action, once) {
      var colliding = false;
      var interval = setInterval(function () {
        if (oxo.elements.elementsAreColliding(element.getBoundingClientRect(), target.getBoundingClientRect())) {
          if (!colliding) {
            action();
            colliding = true;

            if (once) {
              clearInterval(interval);
            }
          }
        } else {
          colliding = false;
        }
      }, 10);
      return interval;
    },

    /**
     * Execute an action once when two element collides
     * @param {HTMLElement} element - The element to observe
     * @param {HTMLElement} target - The element to collide with
     * @param {Function} action - The action to execute
     * @return {Interval} - The timer used for checking
     */
    onCollisionWithElementOnce: function onCollisionWithElementOnce(element, target, action) {
      return oxo.elements.onCollisionWithElement(element, target, action, true);
    },

    /**
     * Test if two elements are in collision
     * @param {Object} element1Pos - The first element position
     * @param {Object} element2Pos - The second element position
     */
    elementsAreColliding: function elementsAreColliding(element1Pos, element2Pos) {
      return element1Pos.x < element2Pos.x + element2Pos.width && element1Pos.x + element1Pos.width > element2Pos.x && element1Pos.y < element2Pos.y + element2Pos.height && element1Pos.height + element1Pos.y > element2Pos.y;
    }
  },
  inputs: {
    keys: {
      enter: 13,
      space: 32,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      a: 65,
      b: 66,
      c: 67,
      d: 68,
      e: 69,
      f: 70,
      g: 71,
      h: 72,
      i: 73,
      j: 74,
      k: 75,
      l: 76,
      m: 77,
      n: 78,
      o: 79,
      p: 80,
      q: 81,
      r: 82,
      s: 83,
      t: 84,
      u: 85,
      v: 86,
      w: 87,
      x: 88,
      y: 89,
      z: 90
    },
    keysListeners: {},

    /**
     * Execute the given action each time the given key is pressed
     * @param {string} key - The key to press to trigger the action
     * @param {Function} action - The function that will be executed
     * @param {boolean} once - If true, the action will be executed only once
     */
    listenKey: function listenKey(key, action, once) {
      if (!once) {
        once = false;
      }

      var code = oxo.inputs.keys[key];

      if (!code) {
        console.error('The key "' + code + '" cannot be found');
        return;
      }

      oxo.inputs.keysListeners[code] = {
        action: action.bind(this, key),
        once: once
      };
    },

    /**
     * Execute the given action each time one of the given key is pressed
     * @param {Array<string>} keys - The keys that should trigger the action
     * @param {Function} action - The action to execute
     */
    listenKeys: function listenKeys(keys, action) {
      keys.forEach(function (key) {
        oxo.inputs.listenKey(key, action);
      });
    },

    /**
     * Execute the given action each time an arrow key is pressed
     * @param {Function} action - The action to execute
     */
    listenArrowKeys: function listenArrowKeys(action) {
      oxo.inputs.listenKeys(['left', 'up', 'right', 'down'], action);
    },

    /**
     * Execute the given action the next time the given key is pressed
     * @param {string} key - The key to press to trigger the action
     * @param {Function} action - The function that will be executed
     * */
    listenKeyOnce: function listenKeyOnce(key, action) {
      oxo.inputs.listenKey(key, action, true);
    },

    /**
     * Cancel the listener for the given key
     * @param {string} key - The key to stop listening to
     */
    cancelKeyListener: function cancelKeyListener(key) {
      delete oxo.inputs.keysListeners[oxo.inputs.keys[key]];
    },

    /**
     * Cancel the listeners for several keys
     * @param {Array<string>} - The keys to stop listening to
     */
    cancelKeysListeners: function cancelKeysListeners(keys) {
      keys.forEach(function (key) {
        oxo.inputs.cancelKeysListener(key);
      });
    },

    /** Cancel the listening of arrow keys */
    cancelArrowKeysListeners: function cancelArrowKeysListeners() {
      oxo.inputs.cancelKeysListener(['left', 'up', 'right', 'down']);
    },

    /**
     * This method will be executed on initialization to listen all the keys
     */
    listenAllKeys: function listenAllKeys() {
      document.addEventListener('keydown', function (event) {
        listener = oxo.inputs.keysListeners[event.keyCode];

        if (listener) {
          listener.action();

          if (listener.once) {
            delete oxo.inputs.keysListeners[event.keyCode];
          }
        }
      });
    },

    /**
     * Get the direction by combining the differents keys pressed
     * @param {Array<string>} pressed - The direction currently pressed
     * @return {string} the direction
     */
    getDirectionFromPressedKeys: function getDirectionFromPressedKeys(pressed) {
      var direction = pressed[0];
      ['left-up', 'left-down', 'right-up', 'right-down'].forEach(function (dir) {
        if (dir.split('-').every(function (dirPart) {
          return pressed.indexOf(dirPart) > -1;
        })) {
          direction = dir;
        }
      });
      return direction;
    }
  },
  player: {
    /**
     * Add one or several points to the score
     * @param {number} points - The number of points to add
     * @return {number} The new score
     */
    addToScore: function addToScore(points) {
      oxo.log('Add ' + points + ' points to the score');
      return oxo.player.setScore(oxo.player.getScore() + points);
    },

    /**
     * Get the score
     * @return {number} The score
     */
    getScore: function getScore() {
      return parseInt(localStorage.getItem('score'));
    },

    /**
     * Remove one or several points from the score
     * @param {number} points - The number of points to remove
     * @return {number} The new score
     */
    removeFromScore: function removeFromScore(points) {
      var newScore = Math.max(0, oxo.player.getScore() - points);
      oxo.log('Remove ' + points + ' points from the score');
      return oxo.player.setScore(newScore);
    },

    /**
     * Set the score
     * @param {number} points - The score
     * @return {number} The score
     */
    setScore: function setScore(points) {
      localStorage.setItem('score', points);
      oxo.log('New score is ' + points);
      oxo.player.refreshScore();
      return points;
    },

    /**
     * Refresh the score display
     */
    refreshScore: function refreshScore() {
      var scoreElement = oxo.getElement('score');

      if (scoreElement) {
        scoreElement.innerText = oxo.player.getScore();
      }
    }
  },
  screens: {
    currentScreen: '',

    /**
     * Load a new screen (and add matching class to the body)
     * @param {string} name - The name of the html file for the screen to load
     * @param {Function} action - The function to execute after loading
     * @return {Promise} - The fetch promise
     */
    loadScreen: function loadScreen(name, action) {
      return fetch('../../screens/' + name + '.html').then(function (response) {
        if (response.ok) {
          response.text().then(function (html) {
            document.body.innerHTML = html;
            document.body.setAttribute('class', name);
            oxo.log('Load screen ' + name);
            oxo.player.refreshScore();
            oxo.animation.getMovableElement();
            oxo.screens.currentScreen = name;

            if (action) {
              action.call();
            }
          });
        }
      });
    },

    /**
     * Get the name of the current screen
     * @return {string} the current screen
     */
    getCurrentScreen: function getCurrentScreen() {
      return oxo.screens.currentScreen;
    }
  },
  utils: {
    /**
     * Get a random number between two limits
     * @param {number} min - The min number
     * @param {number} max - The max number
     * @return {number} - The random number
     */
    getRandomNumber: function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  },

  /**
   * A function that will be run when oxo is called in order to init the game
   */
  init: function init() {
    oxo.screens.loadScreen('home');
    oxo.inputs.listenAllKeys();
    oxo.player.setScore(0);
  },

  /**
   * Pretty logger for oxo events
   * @param {string} message - The information to log
   */
  log: function log(message) {
    console.log('%c OXO: ' + message, 'background-color: gold; padding: 5px');
  },

  /**
   * Find an element with an oxo data attribute in the DOM
   * @param {string} attribute - The data attribute of the element (oxo-data-*)
   */
  getElement: function getElement(attribute) {
    return document.querySelector('[data-oxo-' + attribute + ']');
  }
};
window.oxo.init();
},{}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';

  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58491" + '/');


  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","js/libs/oxo.js"], null)
//# sourceMappingURL=/oxo.54691a36.js.map