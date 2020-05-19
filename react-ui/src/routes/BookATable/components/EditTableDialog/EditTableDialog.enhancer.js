import { reduxForm } from 'redux-form'
import { EDIT_TABLE_FORM_NAME } from 'constants/formNames'

export default reduxForm({
  form: EDIT_TABLE_FORM_NAME,
  // Clear the form for future use (creating another project)
  onSubmitSuccess: (result, dispatch, props) => props.reset()
})
