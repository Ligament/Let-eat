// import { UserIsNotAuthenticated } from 'utils/router'

// // Redirect to list page if logged in
// export default  UserIsNotAuthenticated

import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { setDisplayName } from 'recompose'
import { UserIsNotAuthenticated } from 'utils/router'

export default compose(
  // Add props.match
//   withRouter,
  // Redirect to /login if user is not logged in
  UserIsNotAuthenticated,
)
