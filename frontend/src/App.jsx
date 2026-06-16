// eslint-disable-next-line no-unused-vars
import React from "react"
import Home from "./home/Home.jsx"
import { Route, Routes } from 'react-router-dom'
import Courses from "./courses/Courses.jsx";
import Contact from "./components/Contact.jsx";
import Signup from "./components/Signup.jsx";
import UploadFile from "./components/UploadFile.jsx";
import Notes from './components/Notes';
import ReadNotes from './components/ReadNotes';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Course" element={<Courses />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/ShareNotes" element={<UploadFile />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/read-notes" element={<ReadNotes />} />
        
      </Routes>
    </>
  )
}

export default App;