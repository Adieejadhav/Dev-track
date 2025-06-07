import SignUpUser from "./Pages/SignUpUser"
import { Route ,BrowserRouter,Routes } from "react-router-dom"
import LoginPage from "./Pages/LoginPage"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/"/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
