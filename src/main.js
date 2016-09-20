/**
 * Helper function assert if value on state[scope] has changed, and
 * if so create a new state object, cloned from the original state,
 * and return that as a frozen object.
 */
function set(state, scope, value) {
    if (state != null && state[scope] === value) {
        return state;
    }

    var newState = {};

    if (state != null) {
        for (var key in state) newState[key] = state[key];
    }

    newState[scope] = value;

    return Object.freeze(newState);
}

/**
 * Helper function that allows to easily create registers from a
 * store object or another register. The magic is in recursively
 * passing `parentCreateAction` to internal methods via closure
 * scope.
 */
function createRegister(scope, parentCreateAction) {
    function createAction(action) {
        return parentCreateAction(function (state, payload) {
            var scopedState = state == null ? null : state[scope];

            return set(state, scope, action(scopedState, payload));
        });
    }

    return Object.freeze({
        createAction: createAction,

        createRegister: function(scope) {
            return createRegister(scope, createAction);
        }
    });
}

export function createStore(value) {
    var listeners = [];

    var state = Object.freeze(value);
    var dispatching = false;

    function createAction (action) {
        return function (payload) {
            if (dispatching) throw new Error('Overlapping action dispatch!');

            dispatching = true;

            var value = action(state, payload);

            if (value !== state) {
                state = Object.freeze(value);

                for (var i = 0; i < listeners.length; i++) listeners[i](state);
            }

            dispatching = false;
        };
    }

    return Object.freeze({
        createAction: createAction,

        createRegister: function(scope, value) {
            state = set(state, scope, value);
            return createRegister(scope, createAction);
        },

        getState: function () {
            return state;
        },

        subscribe: function (listener) {
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
    });
}
