/**
 * Created by chenchaochao on 16/3/14.
 */

import '../css/index.scss';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, bindActionCreators, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';

const initialState = {
    todos: ['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']
};

function list(state = initialState, action) {
    switch (action.type) {
        case 'ADD' :
            return Object.assign({}, state, { todos: [...state.todos, action.text] });
        default :
            return state;
    }
}
const myApp = combineReducers({
    list
});
let store = createStore(myApp);

function addTodo(text) {
    return {
        type: 'ADD', text
    };
}

function mapStateToProps(state) {
    return {
        todos: state.list.todos
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ addTodo: addTodo }, dispatch)
    };
}

let App = class App extends Component {
    constructor() {
        super();
        this.addHandler = this.addHandler.bind(this);
    }

    addHandler(e) {
        e.preventDefault();
        if (! this.refs.input.value.trim()) {
            return;
        }
        this.props.actions.addTodo(this.refs.input.value);
        this.refs.input.value = '';
    }

    render() {
        const { todos } = this.props;

        return (
            <div>
                <ul>
                    {todos.map((todo, id) => (<li key={id}>{todo}</li>))}
                </ul>
                <div>
                    <form onSubmit={this.addHandler}>
                        <input ref="input" />
                        <button type="submit">
                            Add Todo
                        </button>
                    </form>
                </div>
            </div>
        );
    }
};

App = connect(mapStateToProps, mapDispatchToProps)(App);

render(<Provider store={store}><App /></Provider>, document.getElementById('container'));
