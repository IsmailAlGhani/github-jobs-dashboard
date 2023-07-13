import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "antd/dist/reset.css";
import { UserProvider } from "./context/UserContext.tsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>
);
