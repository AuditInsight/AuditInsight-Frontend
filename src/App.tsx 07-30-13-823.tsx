import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardPage from "@/app/dashboard/page";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>

    </BrowserRouter>
  );
}