import { DropzoneArea } from 'mui-file-dropzone';

const Dropzone = ({ onChange }) => {
  return (
    <DropzoneArea
      onChange={onChange}
      acceptedFiles={['image/jpeg', 'image/jpg', 'image/png']}
      filesLimit={10}
      useChipsForPreview={true}
      maxFileSize={15 * 1024 * 1024} // Max 10Mb
    />
  );
};

export default Dropzone;
