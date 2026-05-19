import './App.css';
import Signup from './components/Signup';
import { BrowserRouter ,Routes,Route} from "react-router-dom";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StaffSignup from './StaffComponents/StaffSignup';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
      <Route path='/'  element={<Signup/>} ></Route>  
            <Route path='/login'  element={<Login/>} ></Route>  
            <Route path='/Dashboard'  element={<Dashboard/>} ></Route>  
            <Route path='/staff/signup'  element={<StaffSignup/>} ></Route>  



</Routes>
</div>
</BrowserRouter>
  );
}

export default App;
