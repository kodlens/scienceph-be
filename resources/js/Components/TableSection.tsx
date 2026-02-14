import { formatNumber } from "@/helper/helperFunctions"

interface RecentItem {
    id: number
    title: string
    status: string
}

interface TopItem {
    id: number
    title: string
    hits: number
}

interface TableProps {
    title: string
    data: (RecentItem | TopItem)[]
    type: "recent" | "top"
}

const TableSection = ({ title, data, type }: TableProps) => {
    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case "publish":
                return "bg-green-100 text-green-700"
            case "draft":
                return "bg-yellow-100 text-yellow-700"
            case "trash":
                return "bg-red-100 text-red-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>

            {data.length === 0 ? (
                <div className="text-gray-400 text-sm py-6 text-center">
                    No data available
                </div>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="text-left py-2 font-medium">Title</th>
                            <th className="text-left py-2 font-medium">
                                {type === "recent" ? "Status" : "Views"}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="py-3 font-medium text-gray-800">
                                    {item.title}
                                </td>

                                {type === "recent" && "status" in item && (
                                    <td className="py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                )}

                                {type === "top" && "hits" in item && (
                                    <td className="py-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                            {formatNumber(item.hits)} views
                                        </span>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default TableSection
