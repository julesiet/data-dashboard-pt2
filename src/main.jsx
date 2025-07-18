import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Layout from './layouts/Layout.jsx'
import App from './App.jsx'
import ExtraInfo from '../routes/ExtraInfo.jsx'
import NotFound from '../routes/NotFound.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
      <Routes> 

        <Route path="/" element={<Layout />}>
            <Route index path="/" element={<App />}/>
            <Route path=":id" element={<ExtraInfo />}/>
        </Route>       
        <Route path="*" element={<NotFound />}/>

      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
