import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import AddTodoMutation from '../mutations/AddTodoMutation';
import DeleteTodoMutation from '../mutations/DeleteTodoMutation';

import TodoTextInput from './TodoTextInput';
import TodoList from './TodoList';

import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';

class TodoApp extends React.Component {
  state = {
    selectedFilter: 'all'
  };

  handleTextInputSave = (text) => {
    Relay.Store.update(
      new AddTodoMutation({text, viewer: this.props.viewer})
    );
  }

  handleFilterChange = (selectedFilter) => {
    this.setState({selectedFilter});
  }

  handleClearCompleted = () => {
    const viewer = this.props.viewer;
    viewer.todos.edges
      .filter((edge) => edge.node.complete)
      .forEach((edge) => Relay.Store.update(
        new DeleteTodoMutation({viewer, id: edge.node.id})
      ));
  }

  makeHeader() {
    return (
      <header className="header">
        <h1>Todos</h1>
        <TodoTextInput className="new-todo"
                       placeholder="What needs to be done?"
                       autoFocus={true}
                       onSave={this.handleTextInputSave}
        />
      </header>
    );
  }

  makeList() {
    const todos = this.props.viewer.todos.edges;
    if (todos.length > 0) {
      const undone = todos.filter((edge) => !edge.node.complete).length;
      const total = todos.length;
      const filters = ['all', 'active', 'completed'].map((filter) => {
        const selected = filter === this.state.selectedFilter;
        return (
          <li key={filter}>
            <a href={'#' + filter}
               className={classNames({selected})}
               onClick={selected ? null : this.handleFilterChange.bind(this, filter)}>
              {filter}
            </a>
          </li>
        );
      });

      let clearButton;
      if (total - undone > 0) {
        clearButton = (
          <button className="clear-completed"
                  onClick={this.handleClearCompleted}>
            Clear completed
          </button>
        );
      }

      return (
        <footer className="footer">
          <span className="todo-count">
            {undone} / {total} items left
          </span>
          <ul className="filters">
            {filters}
          </ul>
          {clearButton}
        </footer>
      );
    }
  }

  render() {
    const viewer = this.props.viewer;
    const todos = viewer.todos;
    return (
      <div>
        <section className="todoapp">
          {this.makeHeader()}
          <TodoList todos={todos}
                    filter={this.state.selectedFilter}
                    viewer={viewer} />
          {this.makeList()}
        </section>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          <p>
            Created by the <a target="_blank" href="https://risingstack.com/">RisingStack team</a>
          </p>
          <p>
            Part of <a target="_blank" href="http://todomvc.com">TodoMVC</a>
          </p>
        </footer>
      </div>
    );
  }
}

export default Relay.createContainer(TodoApp, {
  prepareVariables() {
    return {
      limit: Number.MAX_SAFE_INTEGER
    };
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        __typename
        todos(first: $limit) {
          edges {
            node {
              id
              complete
            }
          }
          ${TodoList.getFragment('todos')}
        }
        ${TodoList.getFragment('viewer')}
        ${AddTodoMutation.getFragment('viewer')}
      }
    `
  }
});
