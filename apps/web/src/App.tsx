import { Routes, Route, Navigate } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";
import { ThemeProvider } from "./components/ThemeProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkflowEditor from "./pages/WorkflowEditor";
import './styles/reactflow.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const { theme } = useThemeStore();
  
  return (
    <ThemeProvider>
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark' 
        ? 'bg-zinc-900 text-white' 
        : 'bg-white text-zinc-900'
    }`}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/workflows/editor" element={
            <ProtectedRoute>
              <WorkflowEditor />
            </ProtectedRoute>
          } />
          <Route path="/workflows/editor/:id" element={
            <ProtectedRoute>
              <WorkflowEditor />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
    </ThemeProvider>
  );
}
