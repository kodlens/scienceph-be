import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js"

import { Line } from "react-chartjs-2"
import { useEffect, useState } from "react"
import axios from "axios"

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
)

interface MonthlyData {
    year: number
    month: number
    total: number
}

const ArticlesLastSixMonthsChart = () => {

    const [chartData, setChartData] = useState<MonthlyData[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await axios.get<MonthlyData[]>(
            "/dashboard/articles-last-six-months"
        )

        const now = new Date()
        const months: { year: number; month: number; total: number }[] = []

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)

            const found = res.data.find(
                item =>
                    item.year === d.getFullYear() &&
                    item.month === d.getMonth() + 1
            )

            months.push({
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                total: found ? found.total : 0
            })
        }

        setChartData(months)
    }

    const labels = chartData.map(
        item =>
            new Date(item.year, item.month - 1).toLocaleString("en-US", {
                month: "short"
            })
    )

    const data = {
        labels,
        datasets: [
            {
                label: "Published Articles",
                data: chartData.map(item => item.total),
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.2)",
                tension: 0.4,
                fill: true
            }
        ]
    }

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">
                Articles (Last 6 Months)
            </h2>

            <Line data={data} />
        </div>
    )
}

export default ArticlesLastSixMonthsChart
