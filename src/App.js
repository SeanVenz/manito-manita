import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateGift from './pages/CreateGift';
import GiftDetails from './pages/GiftDetails';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<CreateGift />} />
          <Route path="/:linkId" element={<GiftDetails />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
