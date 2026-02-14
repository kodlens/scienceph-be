import { useEffect, useState } from "react"
import axios from "axios"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { DashboardStats, RecentArticle, TopArticle } from "@/types"
import StatCard from "@/Components/StatCard"
import TableSection from "@/Components/TableSection"
import Loader from "@/Components/Loader"

const PublisherDashboard = () => {

    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recent, setRecent] = useState<RecentArticle[]>([])
    const [topArticles, setTopArticles] = useState<TopArticle[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [statsRes, recentRes, topRes] = await Promise.all([
                axios.get<DashboardStats>("/dashboard/stats"),
                axios.get<RecentArticle[]>("/dashboard/recent"),
                axios.get<TopArticle[]>("/dashboard/top-articles"),
            ])

            setStats(statsRes.data)
            setRecent(recentRes.data)
            setTopArticles(topRes.data)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>

    return (
        <div className="p-6 space-y-6">

            {/* Stat Cards */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-5 gap-4">
                <StatCard title="Total Articles" value={stats?.total} />
                <StatCard title="Published" value={stats?.published} />
                <StatCard title="Draft" value={stats?.draft} />
                <StatCard title="Trashed" value={stats?.trashed} />
                <StatCard title="Total Views" value={stats?.total_views} />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard title="Articles This Month" value={stats?.this_month} />
                <StatCard title="Press Releases" value={stats?.press} />
            </div>

            {/* Recent Articles */}
            <TableSection
                title="Recent Articles"
                data={recent}
                type="recent"
            />

            {/* Top Viewed */}
            <TableSection
                title="Top Viewed Articles"
                data={topArticles}
                type="top"
            />

        </div>
    )
}




PublisherDashboard.layout = (page: any) => <AuthenticatedLayout user={page.props.auth.user}>{page}</AuthenticatedLayout>

export default PublisherDashboard;
