package forecast

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)


type Service struct {
	mlURL string
}

func NewService(mlURL string) *Service {
	return &Service{mlURL: mlURL}
}

func (s *Service) Predict(req ForecastRequest) (*ForecastResponse, error) {
	body, _ := json.Marshal(req)

	resp, err := http.Post(
		s.mlURL+"/predict",
		"application/json",
		bytes.NewBuffer(body),
	)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// 👇 IMPORTANT: handle non-200 responses
	if resp.StatusCode != http.StatusOK {
		raw, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("ML error (%d): %s", resp.StatusCode, string(raw))
	}

	var result ForecastResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

func (s *Service) Retrain(data []map[string]interface{}) error {
	payload, _ := json.Marshal(map[string]interface{}{
		"data": data,
	})

	resp, err := http.Post(
		s.mlURL+"/train",
		"application/json",
		bytes.NewBuffer(payload),
	)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return nil
}

