import { useState } from 'react';
import { Box, Grid, Button, Link, Typography } from '@mui/material';
import pdfMake from 'pdfmake';
import { saveAs } from 'file-saver';

import Dropzone from './Dropzone';
import ConvertButton from './ConvertButton';

const App = () => {
  const [files, setFiles] = useState([]);
  const [pdf, setPdf] = useState(null);

  const onDropAreaChange = (loadedFiles) => {
    setFiles(loadedFiles);
  };

  const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const onConvert = async () => {
    let contents = [];
    for (let file of files) {
      const base64 = await blobToDataUrl(file);
      contents = [
        ...contents,
        {
          image: base64,
          cover: { width: 595.28, height: 841.89, valign: 'center', align: 'center' },
        },
      ];
    }
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [0, 0, 0, 0],
      content: contents,
    };
    pdfMake
      .createPdf(docDefinition)
      .getBlob((pdfBlob) =>
        setPdf(pdfBlob /* URL.createObjectURL(pdfBlob, { type: 'application/pdf' }) */),
      );
  };

  const onDownload = () => {
    const [file] = files;
    const [name] = file.name.split('.');
    saveAs(pdf, `${name}.pdf`);
    setPdf(null);
  };

  return (
    <Grid container justifyContent="center">
      <Typography variant="h4" sx={{ m: '0.25rem' }}>
        Only JPEG and PNG are supported !
      </Typography>
      <Dropzone onChange={onDropAreaChange} />

      <ConvertButton disabled={files.length > 0 ? false : true} onClick={onConvert} />

      <Button
        disabled={pdf ? false : true}
        variant="contained"
        sx={{ m: '0.5rem' }}
        onClick={onDownload}
      >
        Download
      </Button>
    </Grid>
  );
};

export default App;
