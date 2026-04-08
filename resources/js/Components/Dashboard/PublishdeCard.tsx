import React from 'react'
import StatCard from '../StatCard'
import axios from 'axios'

const PublishdeCard = () => {

  const [publishCount, setPublishCount] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)


  React.useEffect(() => {
    fetchData()
  }, [])


  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/dashboard/published-count")
      setPublishCount(res.data.count)
    } catch (error) {
      console.error("Failed to fetch published count:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StatCard title="Published" value={publishCount ?? 0} loading={loading} />
  )
}

export default PublishdeCard
