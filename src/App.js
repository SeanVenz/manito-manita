import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateGift from './pages/CreateLink';
import GiftDetails from './pages/GiftDetails';
import AddWishlist from './pages/AddWishlist';
import WishList from './pages/WishList';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<CreateGift />} />
          <Route path="/:linkId" element={<GiftDetails />} />
          <Route path="/:linkId/:nameId" element={<AddWishlist />} />
          <Route path="/:linkId/wishlist" element={<WishList />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
