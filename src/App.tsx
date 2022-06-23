import {
  AddPuppyPage,
  Footer,
  Navbar,
  Puppies,
  PuppyDetail,
  Services,
  Transactions,
  Welcome,
  PuppyTokenPage
} from './components'
import { Navigate, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Routes>
          <Route path="/" element={[<Welcome key="welcome" />, <Services key="services" />]} />
          <Route path="*" element={[<Navigate to="/" key="404" />]} />
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

          <Route path="add-puppy" element={[<AddPuppyPage key="add-puppy" />]} />
          <Route path="token" element={[<PuppyTokenPage key="token" />]} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
