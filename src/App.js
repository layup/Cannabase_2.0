import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard/pages/Dashboard';
import Sidebar from './shared/components/Sidebar';


function App() {
  return (
    <div className='flex flex-col lg:flex-row'>
      <Sidebar />    
      <Dashboard /> 
    </div>

  )
}

export default App;
