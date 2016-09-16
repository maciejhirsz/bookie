# Bookie

Predictable state container in 400 bytes.


> Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it. And to make matters worse: complexity sells better.

  — Edsger W. Dijkstra, 1984


If Redux evolves the ideas from Flux but without it's complexity, Bookie
evolves the ideas from Redux, by reducing the complexity still.


## Gist

```js
import { createStore } from 'bookie';

// First we create the store. The `createStore` function accepts one argument
// which will be the initial state of the store.
//
// Much like in Redux, any value type can be used for the state: Bookie is
// cool with primitives, arrays and objects.
const store = createStore(0);

// Once we got our store, it's time to define actions. Actions are simple
// pure functions that take state and return a new state. Optionally they
// can also accept a second argument for payload.
//
// If the state you are passing is an object, it will also be frozen at
// the root level to ensure that no mutation can occur.
const increment = (state, payload = 1) => state + payload;
const decrement = (state, payload = 1) => state - payload;

// There are few methods available on the store. We can decouple them from
// the object and use them in this fashion - this is particularly useful if
// we wan't to limit the access to dispatch.
const {dispatch, subscribe, getState} = store;

// We can listen to new state emittions with `subscribe`, the callback will
// receive a single argument which is the new (frozen) state.
const unsubscribe = subscribe(console.log);

// Finally lets dispatch some actions!
dispatch(increment);
// -> `1`
dispatch(increment);
// -> `2`

// We can pass payload to our action.
dispatch(increment, 5)
// -> `7`
dispatch(decrement);
// -> `6`

// Calling the function returned from `subscribe` will unsubscribe that
// particular listener.
unsubscribe();

// Since the listener has been removed, calling `dispatch` again will not
// print anything.
dispatch(decrement);

// Finally `getState` returns current state of the store. Once again, this
// value is frozen at the root level to avoid mutations.
console.log('Final state', getState());
// -> `Final state 5`
```
