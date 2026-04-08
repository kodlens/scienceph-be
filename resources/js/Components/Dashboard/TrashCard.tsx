import axios from 'axios'
import React from 'react'
import StatCard from '../StatCard'

const TrashCard = () => {
  const [trashCount, setTrashCount] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/dashboard/trashed-count")
      setTrashCount(res.data.count)
    } catch (error) {
      console.error("Failed to fetch trash count:", error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <StatCard title="Trash" value={trashCount ?? 0} loading={loading} />
  )
}

export default TrashCard
