// React hooks and chart components
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { log } from './utils/logger'; // ⬅️ Custom logging utility for structured logs

// API endpoint for metrics (served via Nginx reverse proxy in container)
const METRICS_API = '/metrics';

function App() {
  // State for current metrics
  const [metrics, setMetrics] = useState({});

  // State for historical metrics to plot trends (up to 20 samples)
  const [history, setHistory] = useState([]);

  // Function to fetch metrics from backend
  const fetchMetrics = async () => {
    log.info("Fetching metrics from API:", METRICS_API);
    try {
      const res = await fetch(METRICS_API);
      if (!res.ok) {
        log.warn(`Non-200 response from backend: ${res.status}`);
      }
      const data = await res.json();
      setMetrics(data);
      log.info("Metrics received:", data);

      const newEntry = {
        ...data,
        time: new Date().toLocaleTimeString() // Human-readable time for the X-axis
      };

      // Keep only the last 20 entries in the trend data
      setHistory(prev => [...prev.slice(-19), newEntry]);
    } catch (err) {
      log.error("Error fetching metrics:", err);
    }
  };

  // Start polling the backend every 10 seconds
  useEffect(() => {
    log.info("Initializing metrics fetch loop...");
    fetchMetrics(); // First fetch immediately
    const interval = setInterval(fetchMetrics, 10000); // Poll every 10s

    return () => {
      clearInterval(interval);
      log.info("Stopped metrics fetch loop.");
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>📊 Monitoring Dashboard</h2>

      {/* Top Summary Cards */}
      <div style={{
        display: 'flex',
        gap: '20px',
        margin: '20px 0',
        flexWrap: 'wrap'
      }}>
        <MetricCard label="CPU Usage" value={`${metrics.cpu_usage || 0} %`} />
        <MetricCard label="Latency" value={`${metrics.latency_ms || 0} ms`} />
        <MetricCard label="Memory Usage" value={`${metrics.memory_usage_mb || 0} MB`} />
        <MetricCard label="Request Count" value={metrics.request_count || 0} />
      </div>

      {/* Line Chart showing metric trends over time */}
      <h3>Live Metrics Trend (Last 20 polls)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cpu_usage" stroke="#8884d8" name="CPU (%)" />
          <Line type="monotone" dataKey="latency_ms" stroke="#82ca9d" name="Latency (ms)" />
          <Line type="monotone" dataKey="memory_usage_mb" stroke="#ff7300" name="Memory (MB)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Component to render each metric card
function MetricCard({ label, value }) {
  return (
    <div style={{
      padding: '15px 20px',
      borderRadius: '10px',
      width: '200px',
      backgroundColor: '#1f2937', // Dark card for better contrast
      color: '#f9fafb',
      fontWeight: '500',
      boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)'
    }}>
      <h4 style={{ marginBottom: '10px', fontSize: '16px' }}>{label}</h4>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}

export default App;


//testing 99