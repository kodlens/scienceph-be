import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { SelectEncoderUser } from './SelectEncoderUser';

const AddMultipleSelectEncoder = () => {

  return (
    <>
      <label>Select Encoder</label>
      <div className="h-[12px]"></div>
      <Form.List
        name="encoder_users"
        rules={[
          {
            validator: async (_, encoder_users) => {
              if (!encoder_users || encoder_users.length < 1) {
                return Promise.reject(new Error('At least 1 encoder'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Form.Item key={key} required={false}>

                {/* ✅ THIS is where name should be */}
                <Form.Item
                  {...restField}
                  name={[name, 'encoder_user_id']}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select encoder or delete this field.',
                    },
                  ]}
                  noStyle
                >
                  <SelectEncoderUser />
                </Form.Item>

                <MinusCircleOutlined
                  className="dynamic-delete-button ml-2"
                  onClick={() => remove(name)}
                />
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
  );
};

export default AddMultipleSelectEncoder;
