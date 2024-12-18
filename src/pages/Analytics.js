import React, { useMemo, useState } from 'react';
import useRetrieveAnalytics from '../hooks/useRetrieveAnalytics';
import Loading from '../components/Loading';
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
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Analytics() {
    const { total, isLoading, dates } = useRetrieveAnalytics();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const generateDateRange = () => {
        if (!fromDate && !toDate) {
            const days = [];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const day = new Date(today);
                day.setDate(today.getDate() - i);
                days.push(day.toISOString().split('T')[0]);
            }
            return days;
        }

        const start = fromDate ? new Date(fromDate) : new Date(Math.min(...dates.map(date => new Date(date))));
        const end = toDate ? new Date(toDate) : new Date(Math.max(...dates.map(date => new Date(date))));

        const days = [];
        const currentDate = new Date(start);

        while (currentDate <= end) {
            days.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    const groupDates = (datesArray) => {
        const counts = {};
        datesArray.forEach((dateString) => {
            const dateOnly = new Date(dateString).toISOString().split('T')[0];
            counts[dateOnly] = (counts[dateOnly] || 0) + 1;
        });
        return counts;
    };

    const processChartData = () => {
        let filteredDates = dates;

        if (fromDate) {
            filteredDates = filteredDates.filter((date) => new Date(date) >= new Date(fromDate));
        }

        if (toDate) {
            filteredDates = filteredDates.filter((date) => new Date(date) <= new Date(toDate));
        }

        const dateRange = generateDateRange();
        const groupedCounts = groupDates(filteredDates);

        const chartData = dateRange.map((date) => ({
            date,
            count: groupedCounts[date] || 0,
        }));

        return chartData;
    };

    if (!isLoading) {
        return <Loading />;
    }

    const processedData = processChartData();

    const chartData = {
        labels: processedData.map((item) => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }),
        datasets: [
            {
                label: 'Number of Links',
                data: processedData.map((item) => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 10
                    }
                }
            },
            title: { 
                display: true, 
                text: 'Analytics - Number of Links Created',
                font: {
                    size: 14 
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { 
                    precision: 0,
                    font: {
                        size: 10 
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 10 
                    }
                }
            }
        },
    };

    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <div className="flex w-full h-full items-center justify-center flex-col p-2 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Total Records: {total}</h2>
            <div className="mb-2 sm:mb-4 w-full px-2 sm:px-0">
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center">
                        <label className="mr-2 text-sm sm:text-base">From:</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="p-1 sm:p-2 border rounded text-sm sm:text-base"
                            max={currentDate}
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="mr-2 text-sm sm:text-base">To:</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="p-1 sm:p-2 border rounded text-sm sm:text-base"
                            max={currentDate}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full px-2 sm:px-0 sm:w-3/4 h-[300px] sm:h-[400px]">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default Analytics;