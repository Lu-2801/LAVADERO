import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Booking } from './pages/Booking';
import { Admin } from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="booking" element={<Booking />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
