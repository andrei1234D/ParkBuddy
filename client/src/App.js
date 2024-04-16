import Login from './pages/Login';
import Home from './pages/Home';
import Nav from './navigation/nav';
import Register from './pages/Register';
import LendSpot from './pages/LendSpot';
import YourSpots from './pages/YourSpots';
import RentSpot from './pages/RentSpot';
import Particles from './particles/ParticlesComp';
import { GlobalStatesContextProvider } from './context/GlobalStatesContext';
import './style/App.css';
// import ProtectedRoutes from '../ProtectedRoutes';

//Router imports
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <GlobalStatesContextProvider>
          <Particles />
          <Nav />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Lend-A-Spot" element={<LendSpot />} />
            <Route path="/Your-Parking-Spots" element={<YourSpots />} />
            <Route path="/Rent-A-Spot" element={<RentSpot />} />
            {/* <Route path="/search" element={<Search />} />
            <Route element={<ProtectedRoutes />}>
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/product/:id/:url" element={<ProductImage />} />
            <Route path="/account" element={<Account />} />
            <Route path="/productDetails" element={<ProductDetails />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Payment" element={<Payment />} />
          </Route> */}
          </Routes>
        </GlobalStatesContextProvider>
      </Router>
    </div>
  );
}

export default App;
