import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { ChildProps } from "./Util";
import { useGlobalContext } from "./context/UserContext";
import { Layout } from "antd";
import DashboardPage from "./pages/DashboardPage";
import DetailPage from "./pages/DetailPage";
import Head from "./components/Head";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

const { Content, Footer, Header } = Layout;

interface ProtectedRouteProps extends ChildProps {
  isAllowed?: boolean;
  redirectPath?: string;
}
const ProtectedRoute = ({
  isAllowed,
  redirectPath = "/landing",
  children,
}: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

function App() {
  const { userId, setUserId } = useGlobalContext();
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(uid);
        navigate("jobs", { replace: true });
      } else {
        setUserId("");
        navigate("landing", { replace: true });
      }
    });
  }, []);
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 25,
          }}
        >
          <Head userId={userId} />
        </Header>
        <Content style={{ height: "100%" }}>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route element={<ProtectedRoute isAllowed={!userId} />}>
              <Route path="Landing" element={<LandingPage />} />
            </Route>
            <Route element={<ProtectedRoute isAllowed={!!userId} />}>
              <Route path="jobs" element={<DashboardPage />} />
              <Route path="jobs/:jobsId" element={<DetailPage />} />
            </Route>
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Github Jobs ©2023 Created by IAG
        </Footer>
      </Layout>
    </>
  );
}

export default App;
