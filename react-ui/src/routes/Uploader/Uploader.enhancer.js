import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setPropTypes, compose, withHandlers } from "recompose";
import { firebaseConnect } from "react-redux-firebase";
import { FOOD_PATH } from "constants/filePaths";

const enhancerPropsTypes = {
  firebase: PropTypes.object.isRequired,
};
const handlers = {
  // Uploads files and push's objects containing metadata to database at dbPath
  onFilesDrop: (props) => (files) => {
    // uploadFiles(storagePath, files, dbPath)
    return props.firebase.uploadFiles(FOOD_PATH, files, FOOD_PATH);
  },
  onFileDelete: (props) => (file, key) => {
    // deleteFile(storagePath, dbPath)
    return props.firebase.deleteFile(file.fullPath, `${FOOD_PATH}/${key}`);
  },
};
export default compose(
  // Create listeners for Real Time Database which write to redux store
  firebaseConnect([{ path: FOOD_PATH }]),
  // connect redux state to props
  connect(({ firebase: { data } }) => ({
    uploadedFiles: data[FOOD_PATH],
  })),
  // Set proptypes of props used within handlers
  setPropTypes(enhancerPropsTypes),
  // Add handlers as props
  withHandlers(handlers)
);
