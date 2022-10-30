import PDFDocument from "pdfkit";
import busboy from "busboy";
import fs from "fs";
import Multipart from "lambda-multipart";

import loggerFactory from "./logger.js";

const logger = loggerFactory.getLogger("converter");

const makeResponse = (body = null, contentType = null, statusCode = 200) => {
  let headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  if (contentType) {
    headers = { ...headers, "Content-Type": contentType };
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

const parseForm = (body, headers) =>
  new Promise((resolve, reject) => {
    const contentType = headers["Content-Type"] || headers["content-type"];
    const bb = busboy({ headers: { "content-type": contentType } });

    const result = {
      files: [],
    };

    bb.on("field", (fieldname, val) => {
      data[fieldname] = val;
    })
      .on("file", (fieldname, file, filename, encoding, mimetype) => {
        file.on("data", (data) => {
          result.files.push({
            file: data,
            fileName: filename,
            contentType: mimetype,
          });
        });
      })
      .on("finish", () => {
        resolve(data);
      })
      .on("error", (err) => {
        reject(err);
      });

    bb.write(body, "base64");
    bb.end();
  });

export const convert = async (event) => {
  logger.info(`Event: ${JSON.stringify(event)}`);
  const { headers, body } = event;
  //  const data = await parseForm(body, headers);

  const parser = new Multipart(event);

  parser.on("field", (key, value) => {
    logger.info("received field", key, value);
  });
  parser.on("file", (file) => {
    //file.headers['content-type']
    file.pipe(fs.createWriteStream(__dirname + "/downloads/" + file.filename));
  });

  parser.on("finish", function (result) {
    //result.files (array of file streams)
    //result.fields (object of field key/values)
    console.log("Finished");
  });

  logger.info(`Data: ${JSON.stringify(data)}`);
  const doc = new PDFDocument({ size: "A4" });
  return makeResponse({ id: "dfdfdf" });
};

export const ping = async (event) => {
  return makeResponse({ message: "pong" }, "application/json");
};
