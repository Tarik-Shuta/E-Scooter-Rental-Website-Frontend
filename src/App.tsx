import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Layout from "./components/Layout.tsx";
import Login from './pages/Login.tsx';
import Signup from "./pages/Signup.tsx";
import Map from "../src/components/Map.tsx";
import Rides from "./pages/Rides.tsx";
import Profile from "./pages/Profile.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminRoute from "./routes/AdminRoute.tsx";
import PublicRoute from "./routes/PublicRoute.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import RideHistory from "./components/RideHistory.tsx";
import AdminRides from "./pages/AdminRides.tsx";


function App() {

  return (

      <Routes>
          <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<PublicRoute><Login /></PublicRoute>}/>
              <Route path="/Signup" element={<PublicRoute><Signup /></PublicRoute>}/>
              <Route path="/Map" element={<Map />}/>
              <Route path="/Rides" element={<PrivateRoute><Rides /></PrivateRoute>}/>
              <Route path="/Profile" element={<Profile />}/>
              <Route path="/AdminDashboard" element={
                  <AdminRoute>    <AdminDashboard/>  </AdminRoute>   }/>
              <Route path="/RideHistory" element={<RideHistory/>}/>
              <Route path="/AdminRides" element={<AdminRoute><AdminRides/></AdminRoute>}/>

          </Route>
      </Routes>


  )
}

export default App
