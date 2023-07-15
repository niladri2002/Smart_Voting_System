import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js";

export const Result = (props) => {
  return (
    <div className="results headings">
      <ChartComponent Candidates={props.Candidates} />
    </div>
  );
};

const ChartComponent = (props) => {
  // const initialVoteData = [
  //   { Name: "Niladri", VoteCount: 2 },
  //   { Name: "Sushanta", VoteCount: 7 },
  //   { Name: "Suvam", VoteCount: 9 },
  // ];
  const initialVoteData = props.Candidates;

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const decodeData = () => {
      const labels = [];
      const data = [];
      const backgroundColors = [];

      initialVoteData.forEach((item) => {
        labels.push(item.Name);
        data.push(item.VoteCount);

        // Generate a random color for each bar

        const randomColor = `rgba(${Math.floor(
          Math.random() * 206 + 50
        )}, ${Math.floor(Math.random() * 206 + 50)}, ${Math.floor(
          Math.random() * 206 + 50
        )}, 1)`;

        backgroundColors.push(randomColor);
      });

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Vote Count",
            data: data,
            backgroundColor: backgroundColors,
          },
        ],
      });
    };

    decodeData();
  }, []);

  useEffect(() => {
    if (chartContainerRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(chartContainerRef.current, {
        type: "bar",
        data: chartData,
        options: {
          indexAxis: "x",
          plugins: {
            legend: {
              display: false,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                grid: {
                  display: false,
                },
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
                },
              },
            ],
          },
        },
      });
    }
  }, [chartData]);

  const updateVoteCount = (index, newVoteCount) => {
    setChartData((prevChartData) => {
      const newData = {
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: prevChartData.datasets[0].data.map((count, i) =>
              i === index ? newVoteCount : count
            ),
          },
        ],
      };
      return newData;
    });
  };

  // Example usage to update the vote count
  const handleVoteCountChange = (index, newVoteCount) => {
    updateVoteCount(index, newVoteCount);
  };

  // Simulating an update by clicking a button
  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * chartData.labels.length);
    const randomVoteCount = Math.floor(Math.random() * 10);
    handleVoteCountChange(randomIndex, randomVoteCount);
  };

  return (
    <>
      <h2>Vote Count Bar Graph</h2>
      <div style={{ width: "600px", height: "300px" }}>
        <canvas ref={chartContainerRef} />
      </div>
      {/* <button onClick={handleClick} disabled={chartData.labels.length === 0}>
        Update Vote Count
      </button> */}
    </>
  );
};
