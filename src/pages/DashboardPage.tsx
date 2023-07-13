import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  List,
  Row,
  Skeleton,
  Space,
  Typography,
  theme,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { DataType, ParamsType } from "../types";
import axios from "axios";
import { timeAgo } from "../Util";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const MAX_ITEM_GET = 10;
enum FilterType {
  DATA,
  SIZE,
}

export default function DashboardPage() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [params, setParams] = useState<ParamsType>({
    description: "",
    location: "",
    fulltime: false,
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    const loadMoreData = async () => {
      if (loading) {
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get<DataType[]>(
          `http://dev3.dansmultipro.co.id/api/recruitment/positions.json`,
          {
            params: {
              description: params.description || undefined,
              location: params.location || undefined,
              page,
            },
          }
        );
        if (response.status === 200) {
          const temp = response.data.filter((item) => item !== null);
          setData((prevState) => {
            const dataTemp = [...prevState, ...temp];
            return isFiltered ? temp : dataTemp;
          });
          setHasMore(temp.length === MAX_ITEM_GET);
          setLoading(false);
          setIsFiltered(false);
        }
      } catch (error) {
        setLoading(false);
        setIsFiltered(false);
      }
    };
    loadMoreData();
  }, [page]);

  const onFinish = (values: ParamsType) => {
    setParams({
      ...values,
      fulltime: !!values.fulltime,
    });
    setIsFiltered(true);
    setPage(1);
  };

  const filteredData = useCallback(
    (type: FilterType) => {
      const tempData = data.filter((item) => item.type === "Full Time");
      return type === FilterType.DATA ? tempData : tempData.length;
    },
    [data]
  );

  const handleDetail = useCallback((id: string) => navigate(id), []);

  return (
    <Row justify={"center"}>
      <Col
        xs={22}
        sm={20}
        xl={18}
        style={{
          marginTop: "2rem",
          backgroundColor: colorBgContainer,
          borderRadius: 8,
        }}
      >
        <div style={{ padding: 16 }}>
          <Space
            direction="vertical"
            style={{ minWidth: "100%", minHeight: "100%" }}
          >
            <Form onFinish={onFinish}>
              <Space direction="horizontal" size={"small"} align="end">
                <Space direction="horizontal" size={"small"} align="end">
                  <Form.Item
                    name={"description"}
                    label={"Job Description"}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: 0 }}
                  >
                    <Input placeholder="Filter by title, benefits, companies, expertise" />
                  </Form.Item>
                  <Form.Item
                    name={"location"}
                    label={"Location"}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ marginBottom: 0 }}
                  >
                    <Input placeholder="Filter by city, state, zip code, country" />
                  </Form.Item>
                </Space>
                <Space direction="horizontal" size={"small"} align="center">
                  <Form.Item name="fulltime" valuePropName="checked" noStyle>
                    <Checkbox>Full Time Only</Checkbox>
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    Search
                  </Button>
                </Space>
              </Space>
            </Form>
            <div
              id="scrollableDiv"
              style={{
                padding: "0 16px",
                border: "1px solid rgba(140, 140, 140, 0.35)",
              }}
            >
              <InfiniteScroll
                dataLength={filteredData(FilterType.SIZE) as number}
                next={() => setPage((prevState) => prevState + 1)}
                hasMore={hasMore}
                height={400}
                loader={
                  loading ? (
                    <Skeleton avatar paragraph={{ rows: 1 }} active />
                  ) : undefined
                }
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
              >
                <List
                  dataSource={filteredData(FilterType.DATA) as DataType[]}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      onClick={() => handleDetail(item.id)}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Row
                          justify={"space-between"}
                          style={{ width: "100%" }}
                        >
                          <Text strong style={{ color: "#0F52BA" }}>
                            {item.title}
                          </Text>
                          <Text>{item.location}</Text>
                        </Row>
                        <Row
                          justify={"space-between"}
                          style={{ width: "100%" }}
                        >
                          <Space direction="horizontal" size={"small"}>
                            <Text type="secondary">{item.company}&nbsp;-</Text>
                            <Text strong style={{ color: "lightgreen" }}>
                              {item.type}
                            </Text>
                          </Space>
                          <Text type="secondary">
                            {timeAgo(item.created_at)}
                          </Text>
                        </Row>
                      </Space>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </Space>
        </div>
      </Col>
    </Row>
  );
}
