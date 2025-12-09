import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateGift from './pages/CreateLink';
import GiftDetails from './pages/GiftDetails';
import AddWishlist from './pages/AddWishlist';
import WishList from './pages/WishList';
import { ToastContainer } from 'react-toastify';
import Analytics from './pages/Analytics';
import ManageExchange from './pages/ManageExchange';
import FloatingManageButton from './components/FloatingManageButton';

function App() {
  return (
    <Router>
      <FloatingManageButton />
      <main>
        <Routes>
          <Route path="/" element={<CreateGift />} />
          <Route path="/:linkId" element={<GiftDetails />} />
          <Route path="/:linkId/manage" element={<ManageExchange />} />
          <Route path="/:linkId/wishlist" element={<WishList />} />
          <Route path="/:linkId/:nameId" element={<AddWishlist />} />
          <Route path="/sean/analytics" element={<Analytics />} />
        </Routes>
      </main>
      <ToastContainer
        position="bottom-right"
        theme="dark"
      />
    </Router>
  );
}

export default App;
