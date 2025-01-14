import React from "react";
import { Bar } from "react-chartjs-2";

const Chart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Data Visualization",
        data: Object.values(data),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div style={{ width: "600px", margin: "20px auto" }}>
      <Bar data={chartData} />
    </div>
  );
};

export default Chart;
