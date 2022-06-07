import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './assets/style/index.css'
import { TransactionsProvider } from './context/TransactionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TransactionsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TransactionsProvider>
  </React.StrictMode>
)
