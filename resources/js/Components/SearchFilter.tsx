import { statusDropdownMenu } from "@/helper/statusMenu"
import { Select, Input, Button } from "antd"

type Filters = {
  id: string;
  title: string
  encoder: string
  modifier: string
  status: string
}

type Props = {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  refetch: () => void
}

const SearchFilter = ({
  filters,
  setFilters,
  refetch,
}: Props) => {
  return (
    <div className="flex flex-col gap-3 mb-5 bg-slate-50 p-4 rounded-lg border border-slate-200">

      <div className="flex gap-4">
        <Select
          className="w-[180px]"
          value={filters.status}
          onChange={(v) =>
            setFilters((prev) => ({ ...prev, status: v }))
          }
          options={statusDropdownMenu('publisher')}
        />

        <Input
          placeholder="Search by id"
          className="w-full"
          value={filters.id}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, id: e.target.value }))
          }
          allowClear
          onKeyDown={(e)=> {
            if(e.key === 'Enter')
              refetch()
          }}
        />
        <Input
          placeholder="Search by article title"
          className="w-full"
          value={filters.title}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, title: e.target.value }))
          }
          allowClear
          onKeyDown={(e)=> {
            if(e.key === 'Enter')
              refetch()
          }}
        />
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by encoder name"
          className="w-full"
          value={filters.encoder}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, encoder: e.target.value }))
          }
          allowClear
          onKeyDown={(e)=> {
            if(e.key === 'Enter')
              refetch()
          }}

        />

        <Input
          placeholder="Search by modifier name"
          className="w-full"
          value={filters.modifier}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, modifier: e.target.value }))
          }
          allowClear
          onKeyDown={(e)=> {
            if(e.key === 'Enter')
              refetch()
          }}


        />
      </div>

      <Button className="ml-auto" type="primary" onClick={refetch}>
        Search
      </Button>
    </div>
  )
}

export default SearchFilter
