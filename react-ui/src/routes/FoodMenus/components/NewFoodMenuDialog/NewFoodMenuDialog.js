import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import { Field } from "redux-form";
import TextField from "components/FormTextField";
import { required } from "utils/form";
import styles from "./NewFoodMenuDialog.styles";
import { DropzoneArea } from "material-ui-dropzone";
import UploadField from "components/FormUploadField";
import Uploader from "components/FormUploadField/Uploader";
import { Grid } from "@material-ui/core";
import PrefixTextField from "components/FormPrefixTextField";
import NumberFormat from "react-number-format";
import ImageUploadField from "components/FormImageUploadField";

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

const useStyles = makeStyles(styles);

function NewFoodMenuDialog({ handleSubmit, open, onRequestClose }) {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="add-menu-dialog-title">Add Menu</DialogTitle>
      <form onSubmit={handleSubmit} className={classes.inputs}>
        <DialogContent>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              {/* <Field name="picture" component="input" type="file" value={null} /> */}
              <Field
                name="pictureUrl"
                component={ImageUploadField}
                label="Food Picture URL"
                validate={[required]}
                style={{ width: 202 }}
              />
            </Grid>
            <Grid item>
              <Field
                name="foodName"
                component={TextField}
                label="Food Name"
                validate={[required]}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Field
                name="detail"
                component={TextField}
                label="Food Detail"
                validate={[required]}
                variant="outlined"
                multiline
                style={{ width: 202 }}
              />
            </Grid>
            <Grid item>
              <Field
                name="price"
                component={PrefixTextField}
                label="Price"
                validate={[required]}
                variant="outlined"
              />
            </Grid>
          </Grid>
          {/* <Field name="foodPicture" label="Drag and drop an image here or click" component={UploadField} /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onRequestClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

NewFoodMenuDialog.propTypes = {
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

export default NewFoodMenuDialog;
