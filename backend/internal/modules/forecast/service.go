package forecast

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)


type Service struct {
	mlURL        string
	trainingRepo *TrainingRepo
}


func NewService(mlURL string, trainingRepo *TrainingRepo) *Service {
	return &Service{
		mlURL:        mlURL,
		trainingRepo: trainingRepo,
	}
}


func (s *Service) Predict(req ForecastRequest) (*ForecastResponse, error) {
	body, _ := json.Marshal(req)

	resp, err := performRequestWithRetry(func() (*http.Response, error) {
		return http.Post(
			s.mlURL+"/predict",
			"application/json",
			bytes.NewBuffer(body),
		)
	})
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

type MetricSummary struct {
	MAE  float64 `json:"mae"`
	RMSE float64 `json:"rmse"`
	R2   float64 `json:"r2"`
}

type MLMetrics struct {
	TrainMetrics            MetricSummary      `json:"train_metrics"`
	ValMetrics              MetricSummary      `json:"val_metrics"`
	FeatureImportances      map[string]float64 `json:"feature_importances"`
	TrainingDurationSeconds float64            `json:"training_duration_seconds"`
	TotalTrainingSamples    int                `json:"total_training_samples"`
	LastTrainedAt           string             `json:"last_trained_at"`
}

func (s *Service) GetMetrics() (*MLMetrics, error) {
	resp, err := performRequestWithRetry(func() (*http.Response, error) {
		return http.Get(s.mlURL + "/metrics")
	})
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("ML metrics service error status: %d", resp.StatusCode)
	}

	var metrics MLMetrics
	if err := json.NewDecoder(resp.Body).Decode(&metrics); err != nil {
		return nil, err
	}
	return &metrics, nil
}

func performRequestWithRetry(reqFunc func() (*http.Response, error)) (*http.Response, error) {
	maxRetries := 5
	backoff := 2 * time.Second

	var lastResp *http.Response
	var lastErr error

	for i := 0; i < maxRetries; i++ {
		resp, err := reqFunc()
		if err != nil {
			lastErr = err
			time.Sleep(backoff)
			backoff *= 2
			continue
		}

		if resp.StatusCode == http.StatusOK {
			return resp, nil
		}

		if resp.StatusCode == http.StatusTooManyRequests ||
			resp.StatusCode == http.StatusBadGateway ||
			resp.StatusCode == http.StatusServiceUnavailable ||
			resp.StatusCode == http.StatusGatewayTimeout {
			resp.Body.Close()
			lastErr = fmt.Errorf("transient error status: %d", resp.StatusCode)
			time.Sleep(backoff)
			backoff *= 2
			continue
		}

		return resp, nil
	}

	if lastErr != nil {
		return nil, lastErr
	}
	return lastResp, fmt.Errorf("request failed after %d retries", maxRetries)
}


