interface LoaderProps {
    size?: "sm" | "md" | "lg"
}

const Loader = ({ size = "md" }: LoaderProps) => {

    const sizes = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-4",
        lg: "h-12 w-12 border-[6px]"
    }

    return (
        <div className="flex items-center justify-center py-10">
            <div
                className={`
                    ${sizes[size]}
                    border-gray-300
                    border-t-blue-600
                    rounded-full
                    animate-spin
                `}
            />
        </div>
    )
}

export default Loader
