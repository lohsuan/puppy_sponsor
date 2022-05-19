import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App'
import './index.css'
import { TransactionsProvider } from './context/TransactionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <TransactionsProvider>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </TransactionsProvider>
)
