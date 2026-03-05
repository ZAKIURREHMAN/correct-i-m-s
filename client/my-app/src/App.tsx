import Register from './pages/Register'
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import CreateOrderItem from "./pages/CreateOrderItem"
import PrintBill from "./pages/PrintBill"
import Returns from "./pages/Returns"
import ProtectedRoute from './routes/ProtectedRoute'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <BrowserRouter>
       <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
         <Route path="/order-items/new" element={<ProtectedRoute><CreateOrderItem /></ProtectedRoute>} />
         <Route path="/print-bill" element={<ProtectedRoute><PrintBill /></ProtectedRoute>} />
         <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
       </Routes>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop theme="colored" closeOnClick pauseOnHover />
     </BrowserRouter>
   )
 }

export default App
