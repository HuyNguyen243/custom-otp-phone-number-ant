import { CountryPhoneInput } from "./phone-input";
import { CountryPhoneInputValue } from "./typings";
import "./App.css";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { isValidPhoneNumber } from "libphonenumber-js";
import { InputOTP } from "./otp-input";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  phone_number: CountryPhoneInputValue;
  otp?: string;
};

function App() {
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <p>test 1</p>
      <p>change b</p>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="otp"
          name="otp"
          rules={[{ required: true, message: "Please input your otp code!" }]}
        >
          <InputOTP length={4} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item<FieldType>
          label="phone_number"
          name="phone_number"
          rules={[
            {
              required: true,
              message: "Please input your phone!",
              validator: (_, value) => {
                const valid = isValidPhoneNumber(value.phone);
                if (!valid) {
                  return Promise.reject("Your phone number is incorrect");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <CountryPhoneInput inline />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default App;
