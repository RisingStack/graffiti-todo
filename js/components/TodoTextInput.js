import React from 'react';
import ReactDom from 'react-dom';

const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;

export default class TodoTextInput extends React.Component {
  static defaultProps = {
    commitOnBlur: false
  }

  state = {
    isEditing: false,
    text: this.props.initialValue || ''
  }

  componentDidMount() {
    ReactDom.findDOMNode(this).focus();
  }

  handleBlur = () => {
    if (this.props.saveOnBlur) {
      this.save();
    }
  }

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  }

  handleKeyDown = (e) => {
    if (this.props.onCancel && e.keyCode === ESC_KEY_CODE) {
      this.props.onCancel();
    } else if (e.keyCode === ENTER_KEY_CODE) {
      this.save();
    }
  }

  save() {
    const text = this.state.text.trim();
    if (this.props.onDelete && text === '') {
      this.props.onDelete();
    } else if (this.props.onCancel && text === this.props.initialValue) {
      this.props.onCancel();
    } else if (text !== '') {
      this.props.onSave(text);
      this.setState({ text: '' });
    }
  }

  render() {
    return (
      <input className={this.props.className || ''}
             placeholder={this.props.placeholder || ''}
             value={this.state.text}
             onBlur={this.handleBlur}
             onChange={this.handleChange}
             onKeyDown={this.handleKeyDown} />
    );
  }
}
