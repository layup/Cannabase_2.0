
import {
  HashRouter, 
  Route,
  Routes
} from 'react-router-dom'

import Dashboard from './dashboard/pages/Dashboard';
import Sidebar from './shared/components/Navigation/Sidebar';
import Jobs from './job/pages/Jobs';
import Job from './job/pages/Job';
import Clients from './client/pages/Clients';
import Client from './client/pages/Client';
import Settings from './settings/Settings';
import CreateReports from './report/pages/CreateReports';
import Reports from './report/pages/Reports';


function App() {
  return (
    <HashRouter>
      <div className='flex flex-col lg:flex-row'>
        <Sidebar />
        <Routes>
          <Route exact path="/" element={<Dashboard />} /> 
          <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:clientName" element={<Client />} />
          <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:jobNum" element={<Job />} />
          <Route path="/settings" element={<Settings />} /> 
          <Route path='/reports' element={<Reports />} /> 
          <Route path='/reports/create' element={<CreateReports />} /> 
        </Routes>
      </div>
    </HashRouter>

  )
}

export default App;
