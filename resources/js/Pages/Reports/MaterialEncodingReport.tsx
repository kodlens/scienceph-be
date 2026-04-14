import { Button, DatePicker, Form } from "antd"
import PublisherLayout from "@/Layouts/PublisherLayout"
import { ReactElement, ReactNode, useState } from "react"
import axios from "axios";
import { User } from "@/types";

type Props = {
  id:number;
  title:string;
  encoded_by_id:number;
  encoded_by_name:string;
  created_at:string;
}

const MaterialEncodingReport = () => {

  const [data, setData] = useState<Props[]>([]);

  const onFinish = (values: any) => {
    // Handle form submission, e.g., fetch report data based on the selected date range
    const dateFrom = values.date_range[0].format('YYYY-MM-DD');
    const dateTo = values.date_range[1].format('YYYY-MM-DD');
    // loadReportData(values.date_range);

    axios.get('/reports/get-material-encoding', {
      params: {
        date_from: dateFrom,
        date_to: dateTo,
      }

    }).then(response => {
      // Process and display the report data as needed
      if(Array.isArray(response.data) && response.data.length > 0){
        setData(response.data);
      }
    }).catch(error => {
      console.error('Error fetching report data:', error);
    });

  };


  return (
    <div>
      <Form onFinish={onFinish}>
        <div className="flex gap-3 flex-col sm:flex-row">
          <Form.Item label='Date Range' name='date_range'>
            <DatePicker.RangePicker />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Generate Report
          </Button>
        </div>

      </Form>


      <div>
        <table>
          <thead>
            <tr>
              <th>Material ID</th>
              <th>Title</th>
              <th>Encoded By</th>
              <th>Date Encoded</th>
            </tr>
          </thead>
          <tbody>
            {/* Data rows will go here */}
            {data.map((item: Props) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.encoded_by_id}</td>
                <td>{item.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MaterialEncodingReport

MaterialEncodingReport.layout = (page:ReactNode) => <PublisherLayout user={(page as ReactElement).props.auth.user}>{page}</PublisherLayout>
