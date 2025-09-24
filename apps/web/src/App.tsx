import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
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
import WorkflowEdit from "./pages/WorkflowEdit";
import './styles/reactflow.css';
import Credentials from "./pages/Credentials/Credentials";
import Register from "./pages/Register";
import NotFound from "./components/notfound/Notfound";
import Docs from "./pages/docs/Docs";
import DocDetail from "./pages/docs/DocDetail";
import ScrollToTop from "./components/ui/ScrolltoTop";
import FormPage from "./pages/FormPage";
import { FormResponses } from "./pages/FormResponses";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const { theme } = useThemeStore();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className={`min-h-screen flex flex-col ${theme === 'dark'
          ? 'bg-zinc-900 text-white'
          : 'bg-white text-zinc-900'
          }`}>
          <Navbar />
          <main className="flex-1 mt-20">
          <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
                  <WorkflowEdit />
                </ProtectedRoute>
              } />
              <Route path="/credentials" element={
                <ProtectedRoute>
                  <Credentials />
                </ProtectedRoute>
              } />
              <Route path="/docs" element={<Docs />} />
              <Route path="/docs/:id" element={<DocDetail />} />
              <Route path="/forms/:formId" element={<FormPage />} />
               <Route path="/form/:formId/responses" element={<FormResponses />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
