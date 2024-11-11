import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateGift from './pages/CreateGift';
import GiftDetails from './pages/GiftDetails';
import AddWishlist from './pages/AddWishlist';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<CreateGift />} />
          <Route path="/:linkId" element={<GiftDetails />} />
          <Route path="/:linkId/:name" element={<AddWishlist />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
