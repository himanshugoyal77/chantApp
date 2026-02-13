import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Mala from "./pages/mala/Mala";
import ShivlingaWrapper from "./pages/ShivlingaWrapper";
import "./App.css";
import OnboardingFlow from "./pages/Onboarding";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route - Mala page */}
        {/* <Route path="/" element={<Layout />}>
          <Route index element={<Mala />} />
        </Route> */}
        
        {/* Onboarding - accessible but not required */}
        <Route path="/" element={<OnboardingFlow />} />
        
        {/* Other routes with layout */}
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/mala" element={<Layout />}>
          <Route index element={<Mala />} />
        </Route>
        <Route path="/shivlinga" element={<Layout />}>
          <Route index element={<ShivlingaWrapper />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
