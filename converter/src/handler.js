import PDFDocument from "pdfkit";
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

export const convert = async (event) => {
  logger.info(`Event: ${JSON.stringify(event)}`);
  const doc = new PDFDocument({ size: "A4" });
  return makeResponse({ id: "dfdfdf" });
};

export const ping = async (event) => {
  return makeResponse({ message: "pong" }, "application/json");
};
