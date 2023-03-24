import logo from './logo.svg';
import './App.css';
import { Route, Link, Routes } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Groups from './components/Groups';
import Create from './components/Create';
import Requests from './components/Requests';

function App() {

  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/groups' element={<Groups />}></Route>
        <Route path='/create' element={<Create />}></Route>
        <Route path='/requests' element={<Requests />}></Route>
      </Routes>
    </div>
  );
}

export default App;
