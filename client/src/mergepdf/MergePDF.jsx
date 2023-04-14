import { Stack, Button } from '@mui/material';
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
      <ToolPage actionButtonLabel="Merge" acceptedFiles={['application/pdf']} onAction={onMerge} />
    </Stack>
  );
};

export default MergePDF;
