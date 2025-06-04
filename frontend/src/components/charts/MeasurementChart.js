import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, // Import TimeScale for time-series data
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import the date adapter

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Register TimeScale
);

const MeasurementChart = ({ title, chartData, yAxisLabel }) => {
  if (!chartData || chartData.labels?.length === 0 || chartData.datasets?.length === 0 || chartData.datasets[0].data?.length === 0) {
    return <p>No data available to display {title.toLowerCase()} chart.</p>;
  }

  const data = {
    labels: chartData.labels, // Expecting an array of dates or time points
    datasets: chartData.datasets.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor || 'rgb(75, 192, 192)',
      backgroundColor: dataset.backgroundColor || 'rgba(75, 192, 192, 0.5)',
      tension: dataset.tension || 0.1,
      fill: dataset.fill !== undefined ? dataset.fill : false,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom height/width via wrapper
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time', // Use 'time' scale for x-axis
        time: {
          unit: 'day', // Display unit. Can be 'month', 'year', etc.
          tooltipFormat: 'MMM dd, yyyy', // Format for tooltips
          displayFormats: {
            day: 'MMM dd', // Format for labels on the x-axis
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: false, // Don't always start y-axis at zero for measurements like weight
        title: {
          display: true,
          text: yAxisLabel || 'Value',
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: '300px', width: '100%', marginBottom: '20px' }}> {/* Basic styling */}
      <Line options={options} data={data} />
    </div>
  );
};

export default MeasurementChart;
