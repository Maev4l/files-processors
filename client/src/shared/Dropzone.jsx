import { DropzoneArea } from 'mui-file-dropzone';

const Dropzone = ({ onChange, acceptedFiles, dropzoneText, showPreview }) =>
  showPreview ? (
    <DropzoneArea
      onChange={onChange}
      acceptedFiles={acceptedFiles}
      filesLimit={10}
      useChipsForPreview={false}
      showPreviewsInDropzone
      showFileNames
      dropzoneText={dropzoneText}
      maxFileSize={15 * 1024 * 1024} // Max 10Mb
    />
  ) : (
    <DropzoneArea
      onChange={onChange}
      acceptedFiles={acceptedFiles}
      filesLimit={10}
      useChipsForPreview
      dropzoneText={dropzoneText}
      maxFileSize={15 * 1024 * 1024} // Max 10Mb
    />
  );
export default Dropzone;
