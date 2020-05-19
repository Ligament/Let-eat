import React from 'react'
import PropTypes from 'prop-types'
import {DropzoneArea} from 'material-ui-dropzone'

const filesPath = 'foodPicture'

function FormUploadField({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) {
  console.log('Field', input);
  
  return (
    <DropzoneArea
      acceptedFiles={['image/*']}
      dropzoneText={label}
      {...input}
      {...custom}
    />
  )
}

FormUploadField.propTypes = {
  formUploadField: PropTypes.object
}

export default FormUploadField
