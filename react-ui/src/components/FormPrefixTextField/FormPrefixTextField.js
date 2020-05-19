import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import NumberFormat from 'react-number-format';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="฿"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function FormPrefixTextField({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) {  
  return (
    <TextField
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      name={input.name}
      onBlur={input.onBlur}
      onChange={input.onChange}
      onDragStart={input.onDragStart}
      onDrop={input.onDrop}
      onFocus={input.onFocus}
      {...custom}
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
    />
  )
}

FormPrefixTextField.propTypes = {
  formPrefixTextField: PropTypes.object
}

export default FormPrefixTextField
