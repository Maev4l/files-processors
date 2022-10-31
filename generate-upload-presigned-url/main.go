package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

var region string = os.Getenv("REGION")
var bucket string = os.Getenv("BUCKET")

const stagingFolder = "staging"

type Json map[string]interface{}

type Document struct {
	FileName  string `json:"fileName"`
	Extension string `json:"ext"`
}

type PresignedUrlRequest struct {
	Documents []Document `json:"documents"`
}

type UnsafeMarshaller interface {
	Encode() ([]byte, error)
}

type PresignedUrl struct {
	DocumentId string `json:"documentId"`
	Url        string `json:"url"`
	Method     string `json:"method"`
	FileName   string `json:"fileName"`
	Extension  string `json:"ext"`
	Rank       int    `json:"rank"`
}

type PresignedUrlResponse struct {
	TaskId string         `json:"taskId"`
	Urls   []PresignedUrl `json:"urls"`
}

func (p PresignedUrlResponse) Encode() ([]byte, error) {
	buffer := &bytes.Buffer{}
	encoder := json.NewEncoder(buffer)
	encoder.SetEscapeHTML(false)
	err := encoder.Encode(p)
	return buffer.Bytes(), err
}

func ApiResponse(status int, body interface{}) (*events.APIGatewayProxyResponse, error) {
	resp := events.APIGatewayProxyResponse{Headers: map[string]string{
		"Content-Type":                     "application/json",
		"Access-Control-Allow-Origin":      "*",
		"Access-Control-Allow-Credentials": "true",
	}}
	resp.StatusCode = status
	if body != nil {
		var stringBody []byte
		switch t := body.(type) {
		case UnsafeMarshaller:
			stringBody, _ = t.Encode()
		default:
			stringBody, _ = json.Marshal(body)
		}

		resp.Body = string(stringBody)
	}

	return &resp, nil
}

func handler(event events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {

	var request PresignedUrlRequest
	err := json.Unmarshal([]byte(event.Body), &request)
	if err != nil {
		log.Error().Err(err).Msg("Fail to parse request")
		return ApiResponse(http.StatusBadRequest, Json{"Message": err.Error()})
	}

	config, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		log.Error().Err(err).Msg("Fail to create AWS SDK")
		return ApiResponse(http.StatusInternalServerError, Json{"Message": err.Error()})
	}

	s3Client := s3.NewFromConfig(config)
	presignClient := s3.NewPresignClient(s3Client)

	if len(request.Documents) > 10 {
		log.Error().Err(err).Msgf("Too many files: %d", len(request.Documents))
		return ApiResponse(http.StatusBadRequest, Json{"Message": "Too many files"})
	}

	urls := make([]PresignedUrl, 0)
	taskId := strings.ToUpper(strings.Replace(uuid.NewString(), "-", "", -1))

	for i, document := range request.Documents {
		if document.Extension != "jpg" && document.Extension != "jpeg" && document.Extension != "png" {
			log.Error().Err(err).Msgf("Incorrect file type: %s.%s", document.FileName, document.Extension)
			return ApiResponse(http.StatusBadRequest, Json{"Message": "Only jpg, jpeg or png are accepted"})
		}

		documentId := strings.ToUpper(strings.Replace(uuid.NewString(), "-", "", -1))
		rank := strconv.Itoa(i)
		res, err := presignClient.PresignPutObject(
			context.TODO(),
			&s3.PutObjectInput{
				Bucket:      aws.String(bucket),
				Key:         aws.String(fmt.Sprintf("%s/%s", stagingFolder, documentId)),
				ContentType: aws.String(fmt.Sprintf("image/%s", document.Extension)),
				Metadata: map[string]string{
					"task":      taskId,
					"filename":  document.FileName,
					"extension": document.Extension,
					"rank":      rank,
				},
			},
			s3.WithPresignExpires(10*time.Minute),
		)

		if err != nil {
			log.Err(err).Msg("Fail to generate presigned url")
			return ApiResponse(http.StatusBadRequest, Json{"Message": err.Error()})
		}

		url := PresignedUrl{
			DocumentId: documentId,
			Url:        res.URL,
			Method:     res.Method,
			FileName:   document.FileName,
			Extension:  document.Extension,
			Rank:       i,
		}

		urls = append(urls, url)
	}

	response := PresignedUrlResponse{
		TaskId: taskId,
		Urls:   urls,
	}

	return ApiResponse(http.StatusOK, response)
}

func main() {
	lambda.Start(handler)
}
