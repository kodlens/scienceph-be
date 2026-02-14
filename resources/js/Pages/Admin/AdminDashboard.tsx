import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DashboardStats, MonthlyData, PageProps, TopArticle } from '@/types'

import axios from 'axios';
import { useEffect, useState } from 'react';



const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthly, setMonthly] = useState<MonthlyData[]>([])
  const [topArticles, setTopArticles] = useState<TopArticle[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const [statsRes, monthlyRes, topRes] = await Promise.all([
        axios.get<DashboardStats>("/dashboard/stats"),
        axios.get<MonthlyData[]>("/dashboard/monthly"),
        axios.get<TopArticle[]>("/dashboard/top-articles"),
      ])

      setStats(statsRes.data)
      setMonthly(monthlyRes.data)
      setTopArticles(topRes.data)

    } catch (error) {
      console.error("Dashboard error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  return (
    <div className="p-6 space-y-6">

      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Articles" value={stats?.total} />
        <StatCard title="Published" value={stats?.published} />
        <StatCard title="Draft" value={stats?.draft} />
        <StatCard title="Total Views" value={stats?.total_views} />
      </div>

      {/* Top Articles Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">
          Top Viewed Articles
        </h2>

        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left py-2">Title</th>
              <th className="text-left py-2">Views</th>
              <th className="text-left py-2">Publish Date</th>
            </tr>
          </thead>
          <tbody>
            {topArticles.map(article => (
              <tr key={article.id} className="border-b">
                <td className="py-2">{article.title}</td>
                <td className="py-2">{article.hits}</td>
                <td className="py-2">{article.publish_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

interface StatCardProps {
  title: string
  value?: number
}

const StatCard = ({ title, value = 0 }: StatCardProps) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  )
}

AdminDashboard.layout = (page: any) => <AuthenticatedLayout user={page.props.auth.user}>{page}</AuthenticatedLayout>

export default AdminDashboard;
