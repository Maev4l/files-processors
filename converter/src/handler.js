import PDFDocument from 'pdfkit';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sizeOf from 'buffer-image-size';

import loggerFactory from './logger.js';

const logger = loggerFactory.getLogger('converter');

const CONVERTED_PREFIX = 'converted';
const region = process.env.REGION;
const bucketName = process.env.BUCKET;

const s3Client = new S3Client({ region });

const makeResponse = (body = null, contentType = null, statusCode = 200) => {
  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  if (contentType) {
    headers = { ...headers, 'Content-Type': contentType };
  }

  let response = {
    statusCode,
    headers,
  };

  if (body) {
    response = { ...response, body: JSON.stringify(body) };
  }

  return response;
};

const streamToBuffer = async (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

const toPDF = async (buf) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0 });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // A4 size
    doc.image(buf, 0, 0, { cover: [595.28, 841.89], valign: 'center', align: 'center' });
    doc.end();
  });

const convertToPDF = async (documentKey) => {
  const documentId = documentKey.split('/').pop();
  const convertedDocumentKey = `${CONVERTED_PREFIX}/${documentId}`;

  try {
    const getObjectParams = {
      Bucket: bucketName,
      Key: documentKey,
    };
    const getObjectCommand = new GetObjectCommand(getObjectParams);
    const { Body: body, Metadata } = await s3Client.send(getObjectCommand);

    logger.info(`Document ${documentKey} fetched.`);

    // Convert stream to Buffer (as GetObjectCommandOutput Body field is a stream)
    const buf = await streamToBuffer(body);
    // Take the size of the image
    const { width, height } = sizeOf(buf);
    logger.info(`Document ${documentKey} size -  width: ${width}px - height: ${height}px`);

    // Convert dimensions to Postscript Points
    const pdf = await toPDF(buf);

    logger.info(`PDF generated for ${documentKey}.`);

    const uploadPreview = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: convertedDocumentKey,
        Body: pdf,
        ContentType: 'application/pdf',
        Metadata,
      },
    });

    await uploadPreview.done();
    logger.info(`PDF ${convertedDocumentKey} saved.`);
  } catch (err) {
    logger.error(`Error while processing document ${documentKey}: ${err.message}`);
  }
};

export const convert = async (event) => {
  const { Records: records } = event;

  const documents = [];
  records.forEach((record) => {
    const {
      s3: {
        object: { key },
      },
    } = record;
    documents.push(key);
  });

  const funcs = documents.map(async (documentKey) => {
    await convertToPDF(documentKey);
  });

  await Promise.all(funcs);
};

export const ping = async () => makeResponse({ message: 'pong' }, 'application/json');
