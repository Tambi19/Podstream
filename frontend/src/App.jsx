import { Routes, Route, Navigate } from "react-router-dom";
import Studio from "./pages/studio";
import Library from "./pages/Library";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";


function App() {
  return (
    < >
      <Navbar />
    
    <Routes>

            <Route path="/" element={<Home />} />


      <Route
        path="/studio/:roomId"
        element={
          <ProtectedRoute>
            <Studio />
          </ProtectedRoute>
        }
      />
            <Route
        path="/library"
        element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        }
      />

            <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />


    </Routes>
        </>

  );
}

export default App;
