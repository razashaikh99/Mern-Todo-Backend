import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import Login from './pages/logın'
import Task from './pages/task'
import { AuthContext } from './context/AuthContext'

function App() {

  const { user } = useContext(AuthContext)
  console.log("user=>", user)
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={'/task'} /> : <Login />} />
      <Route path="/task" element={!user ? <Navigate to={'/'} /> : <Task />} />
    </Routes>
  )
}

export default App
