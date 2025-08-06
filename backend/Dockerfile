# ================================
# 🔧 Stage 1: Build the Go binary
# ================================
FROM golang:1.24-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy go module files
COPY go.mod ./

# Copy the main Go application file
COPY main.go ./

# Download dependencies
RUN go mod tidy

# Compile the Go binary
RUN go build -o server


# ====================================
# 🏃 Stage 2: Run the built binary
# ====================================
FROM alpine:latest

# Set working directory
WORKDIR /app

# Copy the compiled binary from builder stage
COPY --from=builder /app/server .

# Expose port 5000 for the HTTP server
EXPOSE 5000

# Command to start the application
CMD ["./server"]

