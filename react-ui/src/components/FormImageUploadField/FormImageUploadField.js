import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { useFirebase } from "react-redux-firebase";

const FormImageUploadField = ({
  input: { value, onChange },
  label,
  meta: { touched, invalid, error },
  children,
  classes,
  ...custom
}) => {
  const firebase = useFirebase();

  const handleChange = (event) => {
    firebase
      .uploadFile(
        "foods",
        event.target.files && event.target.files[0],
        "images/foods"
      )
      .then(({ File: {downloadURL} }) => {
        onChange(downloadURL)
      });
  };
  

  return (
    <FormControl error={touched && invalid} variant="outlined" {...custom}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        htmlFor="icon-button-file"
        onChange={onChange}
        value={value}
        endAdornment={
          <InputAdornment position="end">
            <input
              style={{ display: "none" }}
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={handleChange}
            />
            <label htmlFor="icon-button-file">
              <IconButton
                aria-label="upload picture"
                component="span"
                edge="end"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </InputAdornment>
        }
        labelWidth={125}
      />
      <FormHelperText>{touched && error}</FormHelperText>
      <img src={value} style={{width: '100%', borderRadius:5, marginTop:8}}/>
    </FormControl>
  );
};

FormImageUploadField.propTypes = {
  formImageUploadField: PropTypes.object,
};

export default FormImageUploadField;
