import { Navbar, Welcome, Services, Footer, Transactions, Puppies, PuppyDetail } from './components'
import { Routes, Route } from 'react-router-dom'
import Admin from './components/Admin'

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Routes>
          <Route path="/" element={[<Welcome key="welcome" />, <Services key="services" />]} />
          <Route path="puppies" element={<Puppies key="puppies" />} />
          <Route path="puppies/:id" element={<PuppyDetail key="puppyDetail" />} />
          <Route
            path="transactions"
            element={[
              <Transactions key="transactions" content="all" />,
              <Services key="services" />
            ]}
          />
          <Route
            path="my-transactions"
            element={[
              <Transactions key="transactions" content="my" />,
              <Services key="services" />
            ]}
          />
          <Route path="admin" element={<Admin key="admin-page" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
