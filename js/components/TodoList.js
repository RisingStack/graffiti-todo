import React from 'react';
import Relay from 'react-relay';

import ChangeTodoStatusMutation from '../mutations/ChangeTodoStatusMutation';

import Todo from './Todo';

class TodoList extends React.Component {
  getFilteredTodos() {
    const edges = this.props.todos.edges;
    if (this.props.filter === 'active') {
      return edges.filter((todo) => !todo.node.complete);
    } else if (this.props.filter === 'completed') {
      return edges.filter((todo) => todo.node.complete);
    }
    return edges;
  }

  handleToggleAllChange = () => {
    const todoCount = this.props.todos.count;
    const edges = this.props.todos.edges;
    const done = edges.filter((edge) => edge.node.complete);
    const setTo = todoCount === done ? false : true;

    edges
      .filter((edge) => edge.node.complete !== setTo)
      .forEach((edge) => Relay.Store.update(
        new ChangeTodoStatusMutation({
          id: edge.node.id,
          complete: setTo
        })
      ));
  }

  makeTodo = (edge) => {
    return (
      <Todo key={edge.node.id}
            todo={edge.node}
            viewer={this.props.viewer} />
    );
  }

  render() {
    const todoCount = this.props.todos.count;
    const edges = this.props.todos.edges;
    const done = edges.filter((edge) => edge.node.complete);
    const todos = this.getFilteredTodos();
    const todoList = todos.map(this.makeTodo);
    return (
      <section className="main">
        <input className="toggle-all"
               type="checkbox"
               checked={todoCount === done}
               onChange={this.handleToggleAllChange} />
        <ul className="todo-list">
          {todoList}
        </ul>
      </section>
    );
  }
}

export default Relay.createContainer(TodoList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${Todo.getFragment('viewer')}
      }
    `,
    todos: () => Relay.QL`
      fragment on TodoConnection {
        count
        edges {
          node {
            id
            complete
            ${Todo.getFragment('todo')}
          }
        }
      }
    `
  }
});
