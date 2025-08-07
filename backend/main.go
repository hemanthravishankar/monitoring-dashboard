package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"
	"sync/atomic"
	"time"
)

// Atomic counter for requests
var requestCount uint64

// Random number generator seeded with current time
var rng = rand.New(rand.NewSource(time.Now().UnixNano()))

// Struct for exposing metrics in JSON
type Metrics struct {
	CPUUsage      int    `json:"cpu_usage"`       // Simulated CPU usage (%)
	LatencyMs     int    `json:"latency_ms"`      // Simulated latency in milliseconds
	MemoryUsageMB int    `json:"memory_usage_mb"` // Simulated memory usage in MB
	RequestCount  uint64 `json:"request_count"`   // Number of times /metrics was hit
}

// Logging helpers for structured logging
func infoLog(msg string) {
	log.Printf("[INFO] %s", msg)
}

func warnLog(msg string) {
	log.Printf("[WARN] %s", msg)
}

func errorLog(msg string) {
	log.Printf("[ERROR] %s", msg)
}

// Handler for /metrics endpoint
func metricsHandler(w http.ResponseWriter, r *http.Request) {
	start := time.Now()

	// Increment the request count atomically
	atomic.AddUint64(&requestCount, 1)

	// Create new simulated metric values
	metrics := Metrics{
		CPUUsage:      rng.Intn(100),            // 0–99%
		LatencyMs:     rng.Intn(300),            // 0–299 ms
		MemoryUsageMB: rng.Intn(4000-100) + 100, // 100–3999 MB
		RequestCount:  requestCount,
	}

	infoLog("Handling /metrics request")

	// Set response headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	// Encode and send JSON response
	if err := json.NewEncoder(w).Encode(metrics); err != nil {
		errorLog("Failed to encode metrics response: " + err.Error())
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Log how long it took to serve
	infoLog("Metrics served in " + time.Since(start).String())
}

func main() {
	// Configure logging to stdout with timestamp + file info
	log.SetOutput(os.Stdout)
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	// Register the /metrics handler
	http.HandleFunc("/metrics", metricsHandler)

	// Optional handler for CORS preflight OPTIONS request
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			infoLog("Handling preflight OPTIONS request")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.WriteHeader(http.StatusOK)
			return
		}
	})

	// Start the backend server
	infoLog("🚀 Backend server starting on port 5000...")
	if err := http.ListenAndServe(":5000", nil); err != nil {
		errorLog("Server failed to start: " + err.Error())
	}
}

// testing 90
