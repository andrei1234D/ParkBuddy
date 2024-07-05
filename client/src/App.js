import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Nav from './navigation/nav';
import Register from './pages/Register';
import LendSpot from './pages/LendSpot';
import YourSpots from './pages/YourSpots';
import RentSpot from './pages/RentSpot';
import Particles from './particles/ParticlesComp';
import AccountSettings from './pages/AccountSettings';
import Settings from './pages/Settings';
import PaymentMethod from './pages/PaymentMethod';
import { GlobalStatesContextProvider } from './context/GlobalStatesContext';
import ProtectedRoutes from './ProtectedRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FadeObserver from './animations/fadeAppear';
import './style/App.css';

function App() {
  return (
    <div>
      <Router basename={process.env.PUBLIC_URL}>
        <GlobalStatesContextProvider>
          <Particles />
          <Nav />
          <FadeObserver>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/Rent-A-Spot" element={<RentSpot />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/paymentMethod" element={<PaymentMethod />} />
                <Route path="/Account-Settings" element={<AccountSettings />} />
                <Route path="/Lend-A-Spot" element={<LendSpot />} />
                <Route path="/Your-Parking-Spots" element={<YourSpots />} />
              </Route>
              <Route path="/Settings" element={<Settings />} />
            </Routes>
          </FadeObserver>
          <ToastContainer />
        </GlobalStatesContextProvider>
      </Router>
    </div>
  );
}

export default App;
