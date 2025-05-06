
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Protected pages
import Dashboard from "./pages/Dashboard";
import Elections from "./pages/Elections";
import ElectionDetails from "./pages/ElectionDetails";
import CreateElection from "./pages/CreateElection";
import Vote from "./pages/Vote";
import CandidateProfile from "./pages/CandidateProfile";
import Results from "./pages/Results";

// Layout components
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/app" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="elections" element={<Elections />} />
              <Route path="elections/create" element={<CreateElection />} />
              <Route path="elections/:id" element={<ElectionDetails />} />
              <Route path="vote/:id" element={<Vote />} />
              <Route path="candidates/:id" element={<CandidateProfile />} />
              <Route path="results/:id" element={<Results />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
