import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import parse from "html-react-parser";
import { DataType } from "../types";
import axios from "axios";
import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Row,
  Space,
  Spin,
  Typography,
  theme,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { FALLBACK_IMG } from "../Util";
import idx from "idx";

const { Text, Title } = Typography;

export default function DetailPage() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { jobsId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType>();
  useEffect(() => {
    const fetchData = async (id: string) => {
      setLoading(true);
      try {
        const result = await axios.get<DataType>(
          `http://dev3.dansmultipro.co.id/api/recruitment/positions/${id}`
        );
        if (result.status === 200) {
          setData(result.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    if (jobsId) {
      fetchData(jobsId);
    }
  }, [jobsId]);
  const handleBack = useCallback(() => {
    navigate(-1);
  }, []);
  const description = idx(data, (_) => _.description);
  const apply = idx(data, (_) => _.how_to_apply);
  const companyLogo = idx(data, (_) => _.company_logo);
  const title = idx(data, (_) => _.title) || "";
  const location = idx(data, (_) => _.location) || "";
  const type = idx(data, (_) => _.type) || "";
  return (
    <Spin spinning={loading}>
      <Row justify={"center"}>
        <Col
          xs={22}
          sm={20}
          xl={18}
          style={{
            margin: "2rem 0 3rem",
            height: "100%",
          }}
        >
          <Space direction="vertical" size={"small"}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              style={{ padding: 0 }}
              onClick={handleBack}
            >
              Back
            </Button>
            <div
              style={{
                backgroundColor: colorBgContainer,
                padding: 16,
                borderRadius: 8,
              }}
            >
              <Space direction="vertical" size={"small"}>
                <Text type="secondary">
                  {type}&nbsp;/&nbsp;{location}
                </Text>
                <Title level={4} style={{ margin: 0 }}>
                  {title}
                </Title>
              </Space>
              <Divider style={{ margin: "8px 0" }} />
              <div
                style={{
                  textAlign: "left",
                }}
              >
                {companyLogo && apply && (
                  <div style={{ float: "right", margin: "0 0 0 15px" }}>
                    <Image
                      width={200}
                      src={companyLogo}
                      fallback={FALLBACK_IMG}
                    />
                    <Card
                      title={"Apply"}
                      bodyStyle={{
                        padding: 16,
                        wordBreak: "break-all",
                        whiteSpace: "normal",
                      }}
                      style={{
                        marginTop: 16,
                        maxWidth: 200,
                      }}
                    >
                      {parse(apply)}
                    </Card>
                  </div>
                )}
                {description && parse(description)}
              </div>
            </div>
          </Space>
        </Col>
      </Row>
    </Spin>
  );
}
