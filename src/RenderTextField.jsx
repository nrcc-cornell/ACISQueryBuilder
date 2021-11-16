import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'

export default class RenderTextField extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      value: '',
     }
  }

  handleChange = name => event => {
    this.setState({value: event.target.value})
    this.props.updateParam({[name]:event.target.value})
  }

  handleFocus = name => event => {
    this.props.updateHelpFor(name)
  }

  handleBlur = () => {
    this.props.updateHelpFor(null)
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return this.props !== nextProps || this.state !== nextState
  }

  componentDidMount() {
    this.setState({value: this.props.value})
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({value: this.props.value})
    }
  }

  render() {
    const id = this.props.id
    const fieldlabel = this.props.fieldlabel
    const options = this.props.options
    const style = options.hasOwnProperty('style') ? options.style : {}
    const required = options.hasOwnProperty('required') ? options.required : false
    const multiline = options.hasOwnProperty('multiline') ? options.multiline : false
    const disabled = options.hasOwnProperty('disabled') ? options.disabled : false
    const placeholder = options.hasOwnProperty('placeholder') ? options.placeholder : ""
    return (
      <div>
        <TextField
          id={id}
          label={fieldlabel}
          value={this.state.value}
          margin="dense"
          variant="outlined"
          required={required}
          multiline={multiline}
          disabled={disabled}
          placeholder={placeholder}
          inputProps={{style:{"paddingTop":"7px", "paddingBottom":"7px", "fontSize":"80%", "width":"100%"}}}
          InputLabelProps={{ shrink: true, style:{color: required ? "limegreen" : "gray"}}}
          style={style}
          onChange={this.handleChange(id)}
          onFocus={this.handleFocus(id)}
          onBlur={this.handleBlur}
    
        />
      </div>
    )
  }
}