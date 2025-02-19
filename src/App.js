import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/Home/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";
import DomesticInquiries from "./pages/InquiriesPage/DomesticInquiries";
import InternationalInquiries from "./pages/InquiriesPage/InternationalInquiries";
import DomesticOffers from "./pages/OffersPage/DomesticOffers";
import InternationalOffers from "./pages/OffersPage/InternationalOffers";
import UsersPage from "./pages/UsersPage/UsersPage";
import LoginPage from "./pages/Login/LoginPage";
import ProtectedRoute from "./services/ProtectedRoute";
import DomesticCancellations from "./pages/CancelledPage/DomesticCancellations";
import InternationalCancellations from "./pages/CancelledPage/InternationalCancellations";
import InquiryForm from "./pages/InquiriesPage/InquiryForm";
import EditInquiryForm from "./pages/InquiriesPage/EditInquiryForm";
import InternationalInquiryForm from "./pages/InquiriesPage/InternationalInquiryForm";
import EditInternationalInquiryForm from "./pages/InquiriesPage/EditInternationalInquiryForm";
import UserForm from "./pages/UsersPage/UserForm";
import EditUserForm from "./pages/UsersPage/EditUserForm";
import BulkUploadDomestic from "./pages/InquiriesPage/BulkUploadDomestic";
import BulkUploadInternational from "./pages/InquiriesPage/BulkUploadInternational";
import Unauthorized from "./pages/Unauthorized";
import { AuthProvider } from "./services/AuthContext";
import CancellationTab from "./pages/CancelledPage/Cancellations";
import OfferCancellationTab from "./pages/CancelledPage/OfferCancellations";
import OfferDomesticCancellations from "./pages/CancelledPage/OfferDomesticCancellations";
import Testing from "./pages/Testing";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainLayout />}>
              <Route index element={
                  <ProtectedRoute allowedAccess={["full"]} selectedPage="home">
                    <HomePage />
                  </ProtectedRoute>
              } />
              <Route path="analytics" element={
                  <ProtectedRoute allowedAccess={["full"]} selectedPage="analytics">
                    <AnalyticsPage />
                  </ProtectedRoute>
              } />
              <Route path="inquiries/domestic" element={
                  <ProtectedRoute allowedAccess={["full","view","limited"]} selectedPage="inquiries/domestic">
                    <DomesticInquiries />
                  </ProtectedRoute>
              } />
              <Route path="inquiries/domestic/new-inquiry" element={
                  <ProtectedRoute allowedAccess={["full","limited"]} selectedPage="inquiries/domestic/modify">
                    <InquiryForm />
                  </ProtectedRoute>
              } />
              <Route path="inquiries/domestic/edit-inquiry/:id" element={
                  <ProtectedRoute allowedAccess={["full","limited"]} selectedPage="inquiries/domestic/modify">
                    <EditInquiryForm />
                  </ProtectedRoute>
              } />
              <Route path="inquiries/domestic/upload" element={
                  <ProtectedRoute allowedAccess={["full"]} selectedPage="inquiries/domestic/upload">
                    <BulkUploadDomestic />
                  </ProtectedRoute>
              } />
              <Route path="inquiries/international" element={
                  <ProtectedRoute allowedAccess={["full","view","limited"]} selectedPage="inquiries/international">
                    <InternationalInquiries />
                  </ProtectedRoute>
              } />
              <Route path="inquiries/international/new-international-inquiry" element={
                  <ProtectedRoute allowedAccess={["full","limited"]} selectedPage="inquiries/international/modify">
                    <InternationalInquiryForm />
                  </ProtectedRoute>
              } />
              <Route path="inquiries/international/edit-international-inquiry/:id" element={
                  <ProtectedRoute allowedAccess={["full","limited"]} selectedPage="inquiries/international/modify">
                    <EditInternationalInquiryForm />
                  </ProtectedRoute>
              } />
              <Route path="inquiries/international/upload" element={
                  <ProtectedRoute allowedAccess={["full"]} selectedPage="inquiries/international/upload">
                    <BulkUploadInternational />
                  </ProtectedRoute>
              } />
              <Route path="offers/domestic" element={
                  <ProtectedRoute allowedAccess={["full","view","limited"]} selectedPage="offers/domestic">
                    <DomesticOffers />
                  </ProtectedRoute>
              } />
              <Route path="offers/international" element={
                  <ProtectedRoute allowedAccess={["full","view","limited"]} selectedPage="offers/international">
                    <InternationalOffers />
                  </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute allowedAccess={["full"]} selectedPage="users">
                  <UsersPage />
                </ProtectedRoute>
              } />
              <Route path="/add-new-users" element={
                <ProtectedRoute allowedAccess={["full"]} selectedPage="add-new-users">
                  <UserForm />
                </ProtectedRoute>
              } />
              <Route path="/edit-user/:id" element={
                <ProtectedRoute allowedAccess={["full"]} selectedPage="edit-user/:id">
                  <EditUserForm />
                </ProtectedRoute>
              } />
              <Route path="cancellations" element={ <CancellationTab /> } />
              <Route path="cancellations/domestic" element={ <DomesticCancellations />} />
              <Route path="cancellations/international" element={ <InternationalCancellations /> } />
              <Route path="offers/cancellations" element={ <OfferCancellationTab /> } />
              <Route path="offers/cancellations/domestic" element={ <OfferDomesticCancellations />} />
              <Route path="/testing" element={<Testing />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
