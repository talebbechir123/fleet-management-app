import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./pages/Home";
import { VehiclesPage } from "./pages/VehiclesPage";
import { AddVehiclePage } from "./pages/AddVehiclePage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/add" element={<AddVehiclePage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
