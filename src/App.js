import './App.css';
import {
  HashRouter, 
  Route,
  Routes
} from 'react-router-dom'

import Dashboard from './dashboard/pages/Dashboard';
import Sidebar from './shared/components/Navigation/Sidebar';
import Jobs from './job/pages/Jobs';
import Job from './job/pages/Job';


function App() {
  return (
    <HashRouter>
      <div className='flex flex-col lg:flex-row'>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} /> 
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobNum" element={<Job />} /> 
        </Routes>
      </div>
    </HashRouter>

  )
}

export default App;
