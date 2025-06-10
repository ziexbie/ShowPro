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
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

import Navbar from './components/Navbar';
import Signup from './pages/signup';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Browse/></ProtectedRoute>} />
        <Route path="/manage-projects" element={<ProtectedRoute><ManageProjects></ManageProjects></ProtectedRoute>} />
        <Route path="/add-project" element={<ProtectedRoute><AddProject/></ProtectedRoute>} />
        <Route path="/update-project/:id" element={<ProtectedRoute><UpdateProject></UpdateProject></ProtectedRoute>} />
        <Route path="/browse-projects" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
        <Route path="/view-project/:id" element={<ProtectedRoute><ViewProject /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><BrowseByCategory /></ProtectedRoute>} />
        <Route path="/category/:category" element={<ProtectedRoute><CategoryWise /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
