import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProfileEdit from "./components/ProfileEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;