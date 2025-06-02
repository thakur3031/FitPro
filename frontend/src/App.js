import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // Default CRA styles

// Page Imports
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsListPage from './pages/ClientsListPage';
import AddClientPage from './pages/AddClientPage';
import ClientDetailPage from './pages/ClientDetailPage';
import EditClientPage from './pages/EditClientPage';
import TrainerSchedulePage from './pages/TrainerSchedulePage';
import ClientSchedulePage from './pages/ClientSchedulePage';
import ClientProgressPage from './pages/ClientProgressPage'; // Import ClientProgressPage
// import NotFoundPage from './pages/NotFoundPage'; // Optional

// Component Imports
import PrivateRoute from './components/PrivateRoute';

function App() { // Renamed AppRevised to App
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* All routes below are protected */}
        <Route path="/" element={<PrivateRoute />}>
          {/* Default route after login */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="clients" element={<ClientsListPage />} />
          <Route path="clients/new" element={<AddClientPage />} />
          <Route path="clients/:clientId" element={<ClientDetailPage />} />
          <Route path="clients/:clientId/edit" element={<EditClientPage />} />
          <Route path="trainer-schedule" element={<TrainerSchedulePage />} />
          <Route path="my-schedule" element={<ClientSchedulePage />} />
          <Route path="my-progress" element={<ClientProgressPage />} /> {/* Add ClientProgressPage route */}

          {/* Example for a NotFoundPage within protected routes */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>

        {/*
          Handles any other path.
          If token exists (user logged in), redirect to dashboard (or a 404 page within the app).
          If no token, redirect to login.
        */}
         {/* This fallback is now more robustly handled by PrivateRoute and session checks.
             If a user is logged in and hits a non-defined route, they could be shown a NotFoundPage
             within the PrivateRoute structure. If not logged in, PrivateRoute handles redirection.
             A simple catch-all can be a redirect to login if no session, or dashboard if session exists.
             However, PrivateRoute at root already handles this.
             For simplicity, let's remove this explicit localStorage check here as PrivateRoute handles it.
             If we want a specific 404 page, it should be nested in PrivateRoute or be a public 404.
         */}
         {/* <Route path="*" element={<Navigate to="/login" replace />} />  // Simplified, or handle with NotFoundPage */}
         {/* A better catch-all would be a NotFoundPage component, but for now, PrivateRoute handles unauthorized access */}
      </Routes>
    </Router>
  );
}

export default App;
