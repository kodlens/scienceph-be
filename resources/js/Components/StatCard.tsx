import { formatNumber } from "@/helper/helperFunctions"

interface StatCardProps {
  title: string
  value?: number
  loading?: boolean
  variant?: "default" | "success" | "warning" | "danger" | "info"
}

const StatCard = ({
  title,
  value = 0,
  loading = false,
  variant = "default"
}: StatCardProps) => {

  const variantStyles = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700"
  }

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200">

      <div className="flex items-center justify-between">

        {/* Text Section */}
        <div>
          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            { loading ? "..." : formatNumber(value)}
          </h2>
        </div>

        {/* Accent Badge */}
        <div className={`h-12 w-12 flex items-center justify-center rounded-full text-sm font-semibold ${variantStyles[variant]}`}>
          #
        </div>

      </div>

    </div>
  )
}

export default StatCard
