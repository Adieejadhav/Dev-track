import { Route ,BrowserRouter,Routes } from "react-router-dom"
import Dashboard from "./Pages/Dashboard"
import ProfilePage from "./Pages/ProfilePage"
import SignUpUser from "./Pages/SignUpUser"
import LoginPage from "./Pages/LoginPage"
import Homepage from "./Pages/Homepage"
import SkillProgressLog from "./Pages/SkillProgressLog"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/signupuser" element={<SignUpUser/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/public-profile/:uid" element={<RecruiterView />} />
            <Route path="/skill/:skillName" element={<SkillProgressLog/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
