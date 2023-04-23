import { useState } from 'react';
import { Grid } from '@mui/material';

import Dropzone from './Dropzone';
import ActionButton from './ActionButton';

const ToolPage = ({ actionButtonLabel, acceptedFiles, dropzoneText, onAction, showPreview }) => {
  const [files, setFiles] = useState([]);

  const onDropAreaChange = (loadedFiles) => {
    setFiles(loadedFiles);
  };

  return (
    <Grid container justifyContent="center">
      <Dropzone
        onChange={onDropAreaChange}
        acceptedFiles={acceptedFiles}
        dropzoneText={dropzoneText}
        showPreview={showPreview}
      />

      <ActionButton
        label={actionButtonLabel}
        disabled={!(files.length > 0)}
        onClick={() => {
          onAction(files);
        }}
      />
    </Grid>
  );
};

export default ToolPage;
