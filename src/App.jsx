import { Route ,BrowserRouter,Routes } from "react-router-dom"
import Dashboard from "./Pages/Dashboard"
import SignUpUser from "./Pages/SignUpUser"
import LoginPage from "./Pages/LoginPage"
import Homepage from "./Pages/Homepage"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/signupuser" element={<SignUpUser/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
