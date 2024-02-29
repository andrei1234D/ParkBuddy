// import Login from './pages/Login';
import Home from './pages/Home';
import Nav from './navigation/nav';
import Particles from './particles/ParticlesComp';
import { LanguageProvider } from './context/LanguageContext';
import './style/App.css';
// import ProtectedRoutes from '../ProtectedRoutes';

//Router imports
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <LanguageProvider>
          <Particles />
          <Nav />
          <Routes>
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/" element={<Home />} />
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
        </LanguageProvider>
      </Router>
    </div>
  );
}

export default App;
