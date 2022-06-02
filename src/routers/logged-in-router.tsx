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
import { RestaurantDetail } from "../pages/client/restaurant-detail";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurants";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { AddDish } from "../pages/owner/add-dish";

const clientRoutes = [
  {
    path: "/",
    component: <Restaurants />,
  },
  {
    path: "/search",
    component: <Search />,
  },
  {
    path: "/category/:slug",
    component: <Categories />,
  },
  {
    path: "/restaurant/:id",
    component: <RestaurantDetail />,
  },
];

const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    component: <EditProfile />,
  },
];

const restaurantRoutes = [
  {
    path: "/",
    component: <MyRestaurants />,
  },
  {
    path: "/add-restaurant",
    component: <AddRestaurant />,
  },
  {
    path: "/restaurant/:id",
    component: <MyRestaurant />,
  },
  {
    path: "/restaurant/:id/add-dish",
    component: <AddDish />,
  },
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
        {data.me.role === "Client" &&
          clientRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}

        {data.me.role === "Owner" &&
          restaurantRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}

        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
