(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.bookie = global.bookie || {})));
}(this, (function (exports) { 'use strict';

function createStore(value) {
    var listeners = [];

    var state = Object.freeze(value);
    var dispatching = false;

    return {
        dispatch: function(action, payload) {
            if (dispatching) throw new Error('Overlapping action dispatch!');

            dispatching = true;

            var value = action(state, payload);

            if (value !== state) {
                state = Object.freeze(value);

                for (var i = 0; i < listeners.length; i++) listeners[i](state);
            }

            dispatching = false;
        },

        getState: function() {
            return state;
        },

        subscribe: function(listener) {
            var lookupStart = listeners.length;
            var subscribed = true;

            listeners.push(listener);

            return function() {
                if (!subscribed) return;

                subscribed = false;

                for (var lookup = lookupStart; lookup >= 0; lookup--) {
                    if (listeners[lookup] === listener) {
                        listeners.splice(lookup, 1);
                        return;
                    }
                }
            }
        }
    };
}

exports.createStore = createStore;

Object.defineProperty(exports, '__esModule', { value: true });

})));