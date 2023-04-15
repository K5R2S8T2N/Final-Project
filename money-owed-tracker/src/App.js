import './App.css';
import { Route, Routes } from "react-router-dom";
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Groups from './components/Groups';
import Create from './components/Create';
import Requests from './components/Requests';
import OpenGroup from './components/OpenGroup';
import OpenPendingGroup from './components/OpenPendingGroup.js';
import AddExpense from './components/AddExpense';

function App() {

  return (
    <div className="App mainPage" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div>
        <NavBar />
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/' element={<Home />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/groups' element={<Groups />}></Route>
          <Route path='/create' element={<Create />}></Route>
          <Route path='/requests' element={<Requests />}></Route>
          <Route path='/opengroup' element={<OpenGroup />}></Route>
          <Route path='/openpending' element={<OpenPendingGroup />}></Route>
          <Route path='/add' element={<AddExpense />}></Route>
        </Routes>
      </div>
      < Footer/>
    </div>
  );
}

export default App;
