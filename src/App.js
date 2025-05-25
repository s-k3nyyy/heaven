import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './authentication/signup';
import LogIn from './authentication/login';
import Layout from './layout';
import DonationPage from './Donate/donationpage';
import Home from './Home/home';
import Explore from './explore/explore2';
import Sponsorship from './sponsorship/sponsorakid';
import Landingpage from './landing page/landingpage';
import SponsorshipForm from './sponsorship/sponsorshipform';
import AboutUsPage from './about';
import BlogPage from './blog';

import Googlecallback from './authentication/googlecallback';
import ProtectedRoute from './protection';
import Verify from './authentication/verify';

import Layoutadmin from './layoutadmin';
import orphanageDashboard from './orphanagestats/orphanage-dashbord';
import SponsorshipsPage from './orphanagestats/sponsorship';
import Donations from './orphanagestats/donations';
import Reports from './orphanagestats/reportspage';
import Settings from './orphanagestats/settings';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landingpage/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/verify" element={<Verify/>}/>
          <Route path= '/aboutus' element={<AboutUsPage/>}/>
          <Route path= '/blogpage' element={<BlogPage/>}/>
          <Route path= '/googlecallback' element={<Googlecallback/>}/>
         

        
         
          <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path='/explore' element={<Explore/>} />
          <Route path='/sponsorship' element={<Sponsorship/>} />
          <Route path= '/sponsorshipform' element={<SponsorshipForm/>}/>
          <Route path="/donationpage" element={<DonationPage/>} />
          </Route>
    


          <Route element={<Layoutadmin />}>
          <Route path='/explore' element={<Explore/>} />
          <Route path='/opharnagedashboard' element={<orphanageDashboard/>}/>
          <Route path= '/sponsorshipspage' element={<SponsorshipsPage/>}/>
          <Route path='/admin-donations' element={<Donations/>} />
          <Route path='/reports' element={<Reports/>} />
          <Route path='/settings' element={<Settings/>} />
          </Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
