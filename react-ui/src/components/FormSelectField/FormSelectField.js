import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";

const FormSelectField = ({
  input,
  label,
  meta: { touched, invalid, error },
  children,
  classes,
  ...custom
}) => (
  <FormControl
    error={touched && invalid}
    {...custom}
    className={classes.formControl}
  >
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      onChange={(event, index, value) => input.onChange(value)}
      {...input}
    >
      {children}
    </Select>
    <FormHelperText>{touched && error}</FormHelperText>
  </FormControl>
);

FormSelectField.propTypes = {
  formSelectField: PropTypes.object,
};

export default FormSelectField;
