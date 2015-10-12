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
    return Relay.QL`mutation{addTodo}`;
  }

  getVariables() {
    return {
      text: this.props.text,
      complete: false
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on addTodoPayload {
        changedTodoEdge
        viewer {
          todos {
            count
          }
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentID: this.props.viewer.id,
      connectionName: 'todos',
      edgeName: 'changedTodoEdge',
      rangeBehaviors: {
        '': 'prepend'
      }
    }];
  }

  getOptimisticResponse() {
    return {
      changedTodoEdge: {
        node: {
          text: this.props.text,
          complete: false
        }
      },
      viewer: {
        id: this.props.viewer.id,
        todos: {
          count: this.props.viewer.todos.count + 1
        }
      }
    };
  }
}
