import { BrowserRouter, Routes} from 'react-router-dom';
//import LoginPage from './pages/LoginPage';
//import SignupPage from './pages/SignupPage';

// admindashboard
import AdminDashboard from './pages/AdminDashboard';
//import BeneficiaryDasboard from './pages/BeneficiaryDashboard';<BeneficiaryDasboard />

function App() {
  return (
    <>
      <BrowserRouter>
      
       <AdminDashboard />
        <Routes>
          {/*<Route path="/" element={<Navigate to="/login" />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/signup' element={<SignupPage />} />*/}
           

              
         
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;