import { DropzoneArea } from 'mui-file-dropzone';

const FILES_LIMIT = 20;
const MAX_FILE_SIZE = FILES_LIMIT * 1024 * 1024; // Max 20Mb

const Dropzone = ({ onChange, acceptedFiles, dropzoneText, showPreview }) =>
  showPreview ? (
    <DropzoneArea
      onChange={onChange}
      acceptedFiles={acceptedFiles}
      filesLimit={FILES_LIMIT}
      useChipsForPreview={false}
      showPreviewsInDropzone
      showFileNames
      dropzoneText={dropzoneText}
      maxFileSize={MAX_FILE_SIZE} // Max 20Mb
    />
  ) : (
    <DropzoneArea
      onChange={onChange}
      acceptedFiles={acceptedFiles}
      filesLimit={FILES_LIMIT}
      useChipsForPreview
      dropzoneText={dropzoneText}
      maxFileSize={MAX_FILE_SIZE} // Max 20Mb
    />
  );
export default Dropzone;
