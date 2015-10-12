import Relay from 'react-relay';

export default class AddTodoMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on Viewer {
      id
      todos {
        count
      }
    }`
  };

  getMutation() {
    return Relay.QL`mutation{deleteTodo}`;
  }

  getVariables() {
    return {
      id: this.props.id
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on deleteTodoPayload {
        id
        viewer {
          id
          todos {
            count
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'todos',
      deletedIDFieldName: 'id'
    }];
  }

  getOptimisticResponse() {
    return {
      id: this.props.id,
      viewer: {
        id: this.props.viewer.id,
        todos: {
          count: this.props.viewer.todos.count - 1
        }
      }
    };
  }
}
