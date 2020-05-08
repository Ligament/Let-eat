import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import { makeStyles } from '@material-ui/core/styles'
import { Field } from 'redux-form'
import TextField from 'components/FormTextField'
import { required } from 'utils/form'
import styles from './NewFoodMenuDialog.styles'
import {DropzoneArea} from 'material-ui-dropzone'
import UploadField from 'components/FormUploadField'
import Uploader from 'components/FormUploadField/Uploader'

const useStyles = makeStyles(styles)

function NewFoodMenuDialog({ handleSubmit, open, onRequestClose }) {
  const classes = useStyles()

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="add-menu-dialog-title">Add Menu</DialogTitle>
      <form onSubmit={handleSubmit} className={classes.inputs}>
        <DialogContent>
          {/* <Field name="foodPicture" label="Drag and drop an image here or click" component={UploadField} /> */}
          <Field
            name="url"
            component={TextField}
            label="Food Picture URL"
            validate={[required]}
          />
          <Field
            name="name"
            component={TextField}
            label="Food Name"
            validate={[required]}
          />
          <Field
            name="detail"
            component={TextField}
            label="Food Detail"
            validate={[required]}
          />
          <Field
            name="price"
            component={TextField}
            label="Price"
            validate={[required]}
          />
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
  )
}

NewFoodMenuDialog.propTypes = {
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
}

export default NewFoodMenuDialog
