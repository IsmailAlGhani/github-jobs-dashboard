import { useCallback } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography, message } from "antd";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { FirebaseError } from "@firebase/util";

const { Title } = Typography;
export default function LandingPage() {
  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err instanceof FirebaseError) {
        message.error(err.name);
      }
    }
  }, []);

  return (
    <Row justify={"center"} align={"middle"} style={{ height: "100vh" }}>
      <Col>
        <Space direction="vertical" size={"large"} align="center">
          <Title level={1}>User Login</Title>
          <Button
            danger
            type="primary"
            shape="round"
            icon={<GoogleOutlined />}
            size={"large"}
            onClick={signInWithGoogle}
          >
            Google
          </Button>
        </Space>
      </Col>
    </Row>
  );
}
