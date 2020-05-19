import React, { useState } from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useFirebaseConnect, isLoaded } from "react-redux-firebase";
import { useSelector } from "react-redux";
import ImagePicker from "react-image-picker";
import LoadingSpinner from "components/LoadingSpinner";
import { makeStyles } from "@material-ui/core";
import 'react-image-picker/dist/index.css'

const FormSelectField = ({
  input,
  label,
  meta: { touched, invalid, error },
  children,
  classes,
  ...custom
}) => {

  useFirebaseConnect([
    { path: 'images', queryParams: ['orderByKey', 'equalTo=tables'] }
  ])
  

  const table = useSelector((state) => state.firebase.ordered.images);
  const [image, imagePick] = useState(null);
  const onPickImage = (img) => {
    imagePick(img);
    input = image;
  };
  if (!isLoaded(table)) {
    return <LoadingSpinner />;
  }
  return (
    <FormControl
      error={touched && invalid}
      {...custom}
    >
      <InputLabel>{label}</InputLabel>
      <ImagePicker
        images={table[0].value.map((image, i) => ({ src: image, value: i }))}
        onPick={onPickImage}
        {...custom}
      />
      <FormHelperText>{touched && error}</FormHelperText>
    </FormControl>
  );
};

FormSelectField.propTypes = {
  formSelectField: PropTypes.object,
};

export default FormSelectField;
