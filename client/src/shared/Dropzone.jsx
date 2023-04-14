import { DropzoneArea } from 'mui-file-dropzone';

const Dropzone = ({ onChange, acceptedFiles }) => (
  <DropzoneArea
    onChange={onChange}
    acceptedFiles={acceptedFiles}
    filesLimit={10}
    useChipsForPreview
    maxFileSize={15 * 1024 * 1024} // Max 10Mb
  />
);
export default Dropzone;
