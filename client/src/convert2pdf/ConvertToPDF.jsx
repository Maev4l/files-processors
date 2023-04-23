import { Stack, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import pdfMake from 'pdfmake';
import { saveAs } from 'file-saver';

import { ToolPage, blobToDataUrl } from '../shared';

const ConvertToPDF = () => {
  const navigate = useNavigate();

  const file2Blob = async (file) => {
    const base64 = await blobToDataUrl(file);
    return {
      image: base64,
      cover: { width: 595.28, height: 841.89, valign: 'center', align: 'center' },
    };
  };

  const onConvert = async (files) => {
    const results = [];
    for (let i = 0; i < files.length; i += 1) {
      results.push(file2Blob(files[i]));
    }

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [0, 0, 0, 0],
      content: await Promise.all(results),
    };
    pdfMake.createPdf(docDefinition).getBlob((pdfBlob) => {
      const [file] = files;
      const [name] = file.name.split('.');
      saveAs(pdfBlob, `${name}.pdf`);
    });
  };

  return (
    <Stack>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
      <Typography variant="h4" sx={{ m: '0.25rem', textAlign: 'center' }}>
        Only JPEG and PNG are supported !
      </Typography>
      <ToolPage
        actionButtonLabel="Convert"
        acceptedFiles={['image/jpeg', 'image/jpg', 'image/png']}
        dropzoneText="Drag and drop one or multiple files here or click"
        showPreview
        onAction={onConvert}
      />
    </Stack>
  );
};

export default ConvertToPDF;
