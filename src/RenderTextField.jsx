import React from 'react'
import TextField from '@mui/material/TextField'

const RenderTextField = (props) => { 

  const handleChange = (event) => {
    props.updateParam({[event.target.id]:event.target.value})
  }

  const handleFocus = (event) => {
    props.updateHelpFor(event.target.id)
  }

  const handleBlur = () => {
    props.updateHelpFor(null)
  }

  const options = props.options ? props.options : {}
  const width = options.hasOwnProperty('width') ? {width:options.width} : {}
  const required = options.hasOwnProperty('required') ? options.required : false
  const multiline = options.hasOwnProperty('multiline') ? options.multiline : false
  const disabled = options.hasOwnProperty('disabled') ? options.disabled : false
  const placeholder = options.hasOwnProperty('placeholder') ? options.placeholder : ""
  const error = options.hasOwnProperty('error') ? options.error : false
  const helperText = options.hasOwnProperty("helperText") ? options.helperText : ""

  return (
    <div>
      <TextField
        id={props.id}
        label={props.fieldlabel}
        value={props.value}
        margin="dense"
        variant="outlined"
        error={error}
        helperText={helperText}
        required={required}
        multiline={multiline}
        disabled={disabled}
        placeholder={placeholder}
        InputLabelProps={{ shrink: true }}
        sx={width}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
  
      />
    </div>
  )
}

export default RenderTextField