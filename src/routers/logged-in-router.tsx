import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { NotFound } from "../pages/404";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { Search } from "../pages/client/search";
import { Categories } from "../pages/client/categories";

const ClientRoutes = [
  <Route key={1} path="/" element={<Restaurants />} />,
  <Route key={2} path="/confirm" element={<ConfirmEmail />} />,
  <Route key={3} path="/edit-profile" element={<EditProfile />} />,
  <Route key={4} path="/search" element={<Search />} />,
  <Route key={5} path="/category/:slug" element={<Categories />} />,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className=" h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === "Client" && ClientRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
