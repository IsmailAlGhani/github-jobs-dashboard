import { useCallback } from "react";
import { BookOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Space, Typography, message } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { FirebaseError } from "@firebase/util";

const { Text } = Typography;
export default function Head({ userId }: { userId: string }) {
  const logOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      if (err instanceof FirebaseError) {
        message.error(err.name);
      }
    }
  }, []);
  return (
    <>
      <Space
        direction="horizontal"
        align="center"
        size={"small"}
        style={{ color: "white" }}
      >
        <BookOutlined />
        <Text strong style={{ color: "white" }}>
          Github
        </Text>
        <Text style={{ color: "white" }}>Jobs</Text>
      </Space>
      {userId ? (
        <Button type="primary" icon={<LogoutOutlined />} onClick={logOut}>
          Log Out
        </Button>
      ) : null}
    </>
  );
}
