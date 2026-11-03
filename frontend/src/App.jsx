// App Root Component with Routing and Layout
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import ListingsPage from './pages/ListingsPage';
import DetailsPage from './pages/DetailsPage';
import ApplyPage from './pages/ApplyPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<ListingsPage />} />
            <Route path="/opportunity/:id" element={<DetailsPage />} />
            <Route path="/apply/:id" element={<ApplyPage />} />
            <Route path="/confirmation/:applicationId" element={<ConfirmationPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;

