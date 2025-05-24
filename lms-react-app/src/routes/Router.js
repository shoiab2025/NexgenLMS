import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";
import Groups from "../components/groups/Groups.js";

/****Layouts*****/
// Make sure to import the layouts correctly
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/
const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/About.js"));
const Alerts = lazy(() => import("../views/ui/Alerts"));
const Badges = lazy(() => import("../views/ui/Badges"));
const Buttons = lazy(() => import("../views/ui/Buttons"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));

/*****Routes******/
const ThemeRoutes = () => (
  <Routes>
    <Route path="/" element={<FullLayout />}>
      <Route path="/" element={<Navigate to="/starter" />} />
      <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
      <Route path="/starter" element={<ProtectedRoute><Starter /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
      <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
      <Route path="/buttons" element={<ProtectedRoute><Buttons /></ProtectedRoute>} />
      <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
      <Route path="/grid" element={<ProtectedRoute><Grid /></ProtectedRoute>} />
      <Route path="/table" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
      <Route path="/forms" element={<ProtectedRoute><Forms /></ProtectedRoute>} />
      <Route path="/breadcrumbs" element={<ProtectedRoute><Breadcrumbs /></ProtectedRoute>} />
    </Route>
  </Routes>
);

export default ThemeRoutes;
