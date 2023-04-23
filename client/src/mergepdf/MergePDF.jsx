import { Stack, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PDFMerger from 'pdf-merger-js/browser';

import { ToolPage } from '../shared';

const MergePDF = () => {
  const navigate = useNavigate();

  const onMerge = async (files) => {
    const merger = new PDFMerger();
    const results = [];
    for (let i = 0; i < files.length; i += 1) {
      results.push(merger.add(files[i]));
    }

    await Promise.all(results);
    const [file] = files;
    const [name] = file.name.split('.');
    await merger.save(name);
  };

  return (
    <Stack>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
      <Typography variant="h4" sx={{ m: '0.25rem', textAlign: 'center' }}>
        Only PDF files are accepted !
      </Typography>
      <ToolPage
        actionButtonLabel="Merge"
        acceptedFiles={['application/pdf']}
        onAction={onMerge}
        dropzoneText="Drag and drop one or multiple files here or click"
        showPreview={false}
      />
    </Stack>
  );
};

export default MergePDF;
