import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import ChangeTodoStatusMutation from '../mutations/ChangeTodoStatusMutation';
import ChangeTodoTextMutation from '../mutations/ChangeTodoTextMutation';
import DeleteTodoMutation from '../mutations/DeleteTodoMutation';

import TodoTextInput from './TodoTextInput';

class Todo extends React.Component {
  state = {
    isEditing: false
  }

  handleCompleteToggle = () => {
    Relay.Store.update(
      new ChangeTodoStatusMutation({
        id: this.props.todo.id,
        complete: !this.props.todo.complete
      }),
    );
  }

  handleLabelDoubleClick = () => {
    this.setState({
      isEditing: true
    });
  }

  handleDestroyClick = () => {
    Relay.Store.update(
      new DeleteTodoMutation({
        id: this.props.todo.id,
        viewer: this.props.viewer
      }),
    );
  }

  handleInputSave = (text) => {
    Relay.Store.update(
      new ChangeTodoTextMutation({
        id: this.props.todo.id,
        text: text
      }),
    );
    this.setState({
      isEditing: false
    });
  }

  handleInputCancel = () => {
    this.setState({
      isEditing: false
    });
  }

  handleInputDelete = () => {
    this.setState({
      isEditing: false
    });
  }

  makeInput() {
    if (this.state.isEditing) {
      return (
        <TodoTextInput className="edit"
          saveOnBlur={true}
          initialValue={this.props.todo.text}
          onSave={this.handleInputSave}
          onCancel={this.handleInputCancel}
          onDelete={this.handleInputDelete} />
      );
    }
    return null;
  }

  render() {
    return (
      <li className={classNames({
        completed: this.props.todo.complete,
        editing: this.state.isEditing
      })}>
        <div className="view">
          <input className="toggle"
            checked={this.props.todo.complete}
            onChange={this.handleCompleteToggle}
            type="checkbox" />
           <label onDoubleClick={this.handleLabelDoubleClick}>
             {this.props.todo.text}
           </label>
           <button className="destroy"
            onClick={this.handleDestroyClick} />
        </div>
        {this.makeInput()}
      </li>
    );
  }
}

export default Relay.createContainer(Todo, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${DeleteTodoMutation.getFragment('viewer')}
      }
    `,
    todo: () => Relay.QL`
      fragment on Todo {
        id
        text
        complete
      }
    `
  }
});
