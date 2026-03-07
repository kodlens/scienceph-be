import { useEffect, useState } from "react"
import axios from "axios"
import { Head } from "@inertiajs/react"
import { BarChartOutlined } from "@ant-design/icons"

import { DashboardStats, RecentArticle, TopArticle } from "@/types"
import StatCard from "@/Components/StatCard"
import TableSection from "@/Components/TableSection"
import Loader from "@/Components/Loader"
import ArticlesLastSixMonthsChart from "@/Components/ArticlesLastSixMonthsChart"
import EncoderLayout from "@/Layouts/EncoderLayout"

const EncoderDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recent, setRecent] = useState<RecentArticle[]>([])
  const [topArticles, setTopArticles] = useState<TopArticle[]>([])
  const [topArticlesLastSixMonths, setTopArticlesLastSixMonths] = useState<TopArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, recentRes, topRes, topResLastSixMonths] = await Promise.all([
        axios.get<DashboardStats>("/dashboard/stats"),
        axios.get<RecentArticle[]>("/dashboard/recent"),
        axios.get<TopArticle[]>("/dashboard/top-articles"),
        axios.get<TopArticle[]>("/dashboard/top-last-six-months")
      ])

      setStats(statsRes.data)
      setRecent(recentRes.data)
      setTopArticles(topRes.data)
      setTopArticlesLastSixMonths(topResLastSixMonths.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <Head title="Dashboard" />

      <div className="flex justify-center">
        <div className="w-full max-w-[1300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-6 py-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-100/60 blur-2xl" />
            <div className="pointer-events-none absolute -left-8 -bottom-14 h-36 w-36 rounded-full bg-sky-100/70 blur-2xl" />

            <div className="relative flex flex-wrap items-start gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-sky-200 bg-white text-sky-600 shadow-sm">
                <BarChartOutlined className="text-xl" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
                  Encoder Panel
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-900">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Monitor encoding progress, publishing status, and content visibility.
                </p>
              </div>

              <div className="ml-auto rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-right shadow-sm">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Total Materials</p>
                <p className="text-2xl font-semibold leading-none text-slate-900">{stats?.total ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard title="Published" value={stats?.published} />
              <StatCard title="Draft" value={stats?.draft} />
              <StatCard title="Trashed" value={stats?.trashed} />
              <StatCard title="Total Views" value={stats?.total_views} />
              <StatCard title="This Month" value={stats?.this_month} />
              <StatCard title="Press Releases" value={stats?.press} />
            </div>

            <ArticlesLastSixMonthsChart />

            <div className="grid gap-6 xl:grid-cols-2">
              <TableSection
                title="Recent Articles"
                data={recent}
                type="recent"
              />
              <TableSection
                title="Top Viewed Last 6 Months"
                data={topArticlesLastSixMonths}
                type="top"
              />
            </div>

            <TableSection
              title="Top Viewed Articles"
              data={topArticles}
              type="top"
            />
          </div>
        </div>
      </div>
    </>
  )
}

EncoderDashboard.layout = (page: any) => <EncoderLayout user={page.props.auth.user}>{page}</EncoderLayout>

export default EncoderDashboard
