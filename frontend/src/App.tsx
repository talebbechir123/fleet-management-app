import { HashRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { VehiclesPage } from "./pages/VehiclesPage";
import { AddVehiclePage } from "./pages/AddVehiclePage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/add" element={<AddVehiclePage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}
