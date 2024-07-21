import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';


function App() {
  const [username, setUsername] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login  setUser = {setUsername}/>} />
        <Route path="/home" element={<Home user = {username}/>} />
      </Routes>
    </Router>
  );
}

export default App;
