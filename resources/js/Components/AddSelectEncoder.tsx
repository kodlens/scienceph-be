import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { SelectEncoderUser } from './SelectEncoderUser';

const AddSelectEncoder = () => {

  return (
    <>
      <label>Select Encoder</label>
      <Form.List
        name="encoder_users"
        rules={[
          {
            validator: async (_, encoder_users) => {
              if (!encoder_users || encoder_users.length < 2) {
                return Promise.reject(new Error('At least 1 encoder'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({key, name, ...restField}) => (
              <Form.Item
                required={false}
                key={key}
              >
                <Form.Item
                  {...restField}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please select encoder or delete this field.",
                    },
                  ]}
                  noStyle
                >
                    <SelectEncoderUser />
                </Form.Item>
                {
                  <MinusCircleOutlined
                    className="dynamic-delete-button ml-2"
                    type='danger'
                    onClick={() => remove(name)}
                  />
                }
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                Add Encoder
              </Button>

              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      
    </>
  )
}

export default AddSelectEncoder
