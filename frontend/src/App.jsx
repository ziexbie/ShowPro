import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ManageProjects from './pages/manageProject';
import AddProject from './pages/AddProject';
import UpdateProject from './pages/updateProject';
import Browse from './pages/browseProjects';
import ViewProject from './pages/viewProject';
import CategoryWise from './pages/categoryWise';
import BrowseByCategory from './pages/BrowseByCategory';
import Login from './pages/login';

import './App.css';

import Navbar from './components/Navbar';
import Signup from './pages/signup';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<BrowseByCategory />} />
        <Route path="/manage-projects" element={<ManageProjects />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/update-project/:id" element={<UpdateProject />} />
        <Route path="/browse-projects" element={<Browse />} />
        <Route path="/view-project/:id" element={<ViewProject />} />
        <Route path="/categories" element={<BrowseByCategory />} />
        <Route path="/category/:category" element={<CategoryWise />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
