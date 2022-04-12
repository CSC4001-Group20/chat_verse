import './App.css';
import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    // useRouteMatch,
    // useParams
  } from "react-router-dom";
import ChatRoom from './components/ChatRoom/ChatRoom';
import Login from './components/Login/Login';

function App() {

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path='/chatroom' element={<ChatRoom />}/>
                    <Route path='/login' element={<Login />} />
                    <Route path='/sign' element={<Login />} />
                    <Route path='/' element={<Login />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
