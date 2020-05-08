import React from "react";
import PropTypes from "prop-types";
import { map } from "lodash";
import Dropzone from "react-dropzone";

const Uploader = ({ uploadedFiles, onFileDelete, onFilesDrop }) => (
  <div>
    <Dropzone onDrop={onFilesDrop}>
      <div>Drag and drop files here or click to select</div>
    </Dropzone>
    {uploadedFiles && (
      <div>
        <h3>Uploaded file(s):</h3>
        {map(uploadedFiles, (file, key) => (
          <div key={file.name + key}>
            <span>{file.name}</span>
            <button onClick={() => onFileDelete(file, key)}>Delete File</button>
          </div>
        ))}
      </div>
    )}
  </div>
);

Uploader.propTypes = {
  firebase: PropTypes.object.isRequired,
  uploadedFiles: PropTypes.object,
};

export default Uploader;
