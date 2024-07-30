import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./Components/Layout";
import WebContext from "./context/context";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Products from "./pages/Products";
import Campaigns from "./pages/Campaigns";
import Twilio from "./pages/Twilio";
import AddCampaigns from "./pages/AddCampaigns";
import AddProducts from "./pages/AddProducts";
import Profile from "./pages/Profile";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route
          path="/onboarding"
          element={
            <PrivateRoute>
              <Onboarding />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <WebContext>
                <Layout>
                  <Products />
                </Layout>
              </WebContext>
            </PrivateRoute>
          }
        />
        <Route
          path="/products/add-products"
          element={
            <PrivateRoute>
              <WebContext>
                <Layout>
                  <AddProducts isEdit={false} />
                </Layout>
              </WebContext>
            </PrivateRoute>
          }
        />
        <Route
          path="/products/edit-products"
          element={
            <PrivateRoute>
              <WebContext>
                <Layout>
                  <AddProducts isEdit={true} />
                </Layout>
              </WebContext>
            </PrivateRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <PrivateRoute>
              <WebContext>
                <Layout>
                  <Campaigns />
                </Layout>
              </WebContext>
            </PrivateRoute>
          }
        />
        <Route
          path="/campaigns/add-campaigns"
          element={
            <PrivateRoute>
              <WebContext>
                <Layout>
                  <AddCampaigns isEdit={false} />
                </Layout>
              </WebContext>
            </PrivateRoute>
          }
        />
        <Route
          path="/campaigns/edit-campaigns"
          element={
            <PrivateRoute>
              <WebContext>
                <Layout>
                  <AddCampaigns isEdit={true} />
                </Layout>
              </WebContext>
            </PrivateRoute>
          }
        />
        <Route
          path="/twilio"
          element={
            <PrivateRoute>
              <WebContext>
                <Layout>
                  <Twilio />
                </Layout>
              </WebContext>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <WebContext>
                <Layout>
                  <Profile />
                </Layout>
              </WebContext>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("bot_customer_token") ? (
    children
  ) : (
    <Navigate to="/" />
  );
};
