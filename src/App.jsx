import { Navbar, Welcome, Services, Footer, Transactions } from "./components";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          {/* <Route path="services" element={<Services />} /> */}
          <Route path="transactions" element={[<Transactions key="transactions" content="all"/>, <Services key="services"/>]} />
          <Route path="my-transactions" element={[<Transactions key="transactions" content="my"/>, <Services key="services"/>]} />
          {/* <Welcome /> */}
          {/* <Services /> */}
          {/* <Transactions /> */}
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App