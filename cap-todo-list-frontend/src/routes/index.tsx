import { createFileRoute, Navigate } from '@tanstack/react-router'
import logo from '../logo.svg'
import '../App.css'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {

  const navigate = useNavigate();

  return (
    <div className="App">
      <div className='center-container'>
        <form className='form-box'>
        <h1>Online ToDo-List</h1>
          {/*button to /login */}
          <button className='login-button' onClick={() => navigate({ to: '/login' })}>Login</button>
          {/*button to /register*/}
          <button className='register-button' onClick={() => navigate({ to: '/register' })}>Register</button>        
        </form> 
      </div>

    </div>
  )
}
