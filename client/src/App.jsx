import { Routes, Route, Link } from "react-router-dom";
import AISearch from "./pages/AISearch";
import GlassTodo from "./pages/GlassTodo";

function App() {


  return (
    <>
      <Routes>
        <Route path="/search" element={<AISearch/>} />
        <Route path="/todo" element={<GlassTodo/>} />
      </Routes>
    </>
  )
}

export default App
