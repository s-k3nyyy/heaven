import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Authentication
import SignUp from './authentication/signup';
import LogIn from './authentication/login';
import Googlecallback from './authentication/googlecallback';
import Verify from './authentication/verify';

// Public Pages
import Landingpage from './landing page/landingpage';
import AboutUsPage from './about';
import BlogPage from './blog';
import OrphanageProfile from './explore/Orphanageprofile';

// User Layout & Pages
import Layout from './layout';
import Home from './Home/home';
import Explore from './explore/explore2';
import SponsorChildList from './sponsorship/SponsorChildList';
import SponsorshipForm from './sponsorship/sponsorshipform';
import DonationPage from './Donate/donationpage';

// Admin Layout & Pages
import Layoutadmin from './layoutadmin';
import OrphanageDashboard from './orphanagestats/orphanageDashboard';
import SponsorshipsPage from './orphanagestats/sponsorship';
import Donations from './orphanagestats/donations';
import AddOrphanage from './orphanagestats/AddOrphanage';

import Reports from './orphanagestats/reportspage';
import Settings from './orphanagestats/settings';
import SponsorAChild from './orphanagestats/SponsorAChild'; // ✅ NEW COMPONENT

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/blogpage" element={<BlogPage />} />
          <Route path="/googlecallback" element={<Googlecallback />} />
          <Route path="/orphanage/:id" element={<OrphanageProfile />} />

          {/* User layout routes */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/sponsorship" element={<SponsorChildList />} />
            <Route path="/sponsorshipform" element={<SponsorshipForm />} />
            <Route path="/donationpage" element={<DonationPage />} />
          </Route>

          {/* Admin layout routes */}
          <Route element={<Layoutadmin />}>
            <Route path="/add-orphanage" element={<AddOrphanage />} />
            <Route path="/admin/explore" element={<Explore />} />
            <Route path="/orphanageDashboard" element={<OrphanageDashboard />} />
            <Route path="/sponsorshipspage" element={<SponsorshipsPage />} />
            <Route path="/sponsor-a-child" element={<SponsorAChild />} /> {/* ✅ NEW ROUTE */}
            <Route path="/admin-donations" element={<Donations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
