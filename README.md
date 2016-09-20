# Bookie

Predictable and scalable state container in 0.5kB.


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
// can also accept a second argument for payload, more about that later.
const increment = store.createAction(state => state + 1);
const decrement = store.createAction(state => state - 1);

// We can listen to new state emittions with `subscribe`, the callback will
// receive a single argument which is the new (frozen) state.
const unsubscribe = store.subscribe(console.log);

// Finally lets dispatch some actions! All you have to do is call a function,
// no indirection required.
increment();
// -> `1`
increment();
// -> `2`
decrement();
// -> `1`

// Calling the function returned from `subscribe` will unsubscribe that
// particular listener.
unsubscribe();

// Since the listener has been removed, calling `dispatch` again will not
// print anything.
decrement();

// Finally `getState` returns current state of the store. Once again, this
// value is frozen at the root level to avoid mutations.
console.log('Final state', store.getState());
// -> `Final state 0`
```
