const test = require('tape');
const { createStore } = require('../dist/bookie.js');

test('Creating a store', assert => {
    const store = createStore(0);

    assert.equals(store.getState(), 0, 'State should be set to default');

    assert.end();
});

test('Actions on a store', assert => {
    const store = createStore(0);

    assert.equals(store.getState(), 0, 'State should be set to default');

    const increment = store.createAction(state => state + 1);
    const decrement = store.createAction(state => state - 1);

    increment();

    assert.equals(store.getState(), 1, 'State should be incremented');

    decrement();

    assert.equals(store.getState(), 0, 'State should be decremented');

    assert.end();
});

test('State observer', assert => {
    assert.plan(3);

    const store = createStore(0);

    assert.equals(store.getState(), 0, 'State should be set to default');

    const increment = store.createAction(state => state + 1);

    let observerExpect = 0;

    let unsubscribe = store.subscribe(state => {
        assert.ok(state === ++observerExpect, 'State should be increased');
    });

    increment();
    increment();

    unsubscribe();

    increment();
});

test('Object as state', assert => {
    const store = createStore({ loggedIn: false });

    assert.equals(store.getState().loggedIn, false, 'State should be set to default');

    const logIn = store.createAction((state, name) => {
        return {
            loggedIn : true,
            name
        };
    });

    const logOut = store.createAction(state => ({ loggedIn: false }));

    logIn('Maciej');

    {
        const state = store.getState();

        assert.equals(state.loggedIn, true, 'State should be updated');
        assert.equals(state.name, 'Maciej', 'State should be updated');

        state.loggedIn = 100;
        state.name = 'Foobar';

        assert.equals(state.loggedIn, true, 'State cannot be mutated');
        assert.equals(state.name, 'Maciej', 'State cannot be mutated');
    }

    logOut();

    {
        const state = store.getState();

        assert.equals(state.loggedIn, false, 'State should be updated');
        assert.equals(state.name, undefined, 'State should be updated');

        state.loggedIn = 100;
        state.name = 'Foobar';

        assert.equals(state.loggedIn, false, 'State cannot be mutated');
        assert.equals(state.name, undefined, 'State cannot be mutated');
    }

    assert.end();
});

test('Create registers', assert => {
    const store = createStore();

    assert.equals(store.getState(), undefined, 'Initial state is undefined');

    const foo = store.createRegister('foo', 0);
    const bar = store.createRegister('bar', 0);

    {
        const state = store.getState();

        assert.equals(state.foo, 0, 'Register state is set to default');
        assert.equals(state.bar, 0, 'Register state is set to default');
    }

    assert.end();
});

test('Actions on registers', assert => {
    const store = createStore();

    assert.equals(store.getState(), undefined, 'Initial state is undefined');

    const foo = store.createRegister('foo', 0);
    const bar = store.createRegister('bar', 0);

    const fooInc = foo.createAction(state => state + 1);
    const barInc = bar.createAction(state => state + 1);

    fooInc();

    {
        const state = store.getState();

        assert.equals(state.foo, 1, '`foo` is increased');
        assert.equals(state.bar, 0, '`bar` is the same');

        state.foo = 100;
        state.bar = 200;

        assert.equals(state.foo, 1, 'State cannot be mutated');
        assert.equals(state.bar, 0, 'State cannot be mutated');
    }

    barInc();

    {
        const state = store.getState();

        assert.equals(state.foo, 1, '`foo` is the same');
        assert.equals(state.bar, 1, '`bar` is increased');

        state.foo = 100;
        state.bar = 200;

        assert.equals(state.foo, 1, 'State cannot be mutated');
        assert.equals(state.bar, 1, 'State cannot be mutated');
    }

    assert.end();
});

test('Register actions trigger store observers', assert => {
    assert.plan(3);

    const store = createStore();

    assert.equals(store.getState(), undefined, 'Initial state is undefined');

    let unsubscribe = store.subscribe(state => {
        const {foo, bar} = state;
        assert.ok(typeof foo === 'number' && typeof bar === 'number', 'Observer triggered');
    });

    const foo = store.createRegister('foo', 0);
    const bar = store.createRegister('bar', 0);

    const fooInc = foo.createAction(state => state + 1);
    const barInc = bar.createAction(state => state + 1);

    fooInc();
    barInc();

    unsubscribe();

    fooInc();
    barInc();
});
