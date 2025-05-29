import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  

  const navigate = useNavigate();
  
  // validate login info
  const login =  async () => {
    const data = { username, password }
    try {
      const answer = await fetch("http://localhost:4004/browse/login", {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // make result (user ID) usable
      const jsonResult = await answer.text();
      const value = JSON.parse(jsonResult).value;
      setResult(value)

      // go to /todolist if answer is ok
      navigate({ to: '/todolist', search: { userId: value } });
      // set error if there is error
    } catch (error) {
      setError(error)
    }
  }
  

  return <div>
    {/*back button to index.tsx*/}
    <button className='back-button' onClick={() => navigate({ to: '/' })}> ⬅️ Back </button>
    <div className="center-container">
      <form className='form-box'>
        <h1>Login</h1>
        {/*login input fields*/}
        <input type="text" placeholder='username' id='username' onChange={(e) => setUsername(e.target.value)}/>
        <input type="password" placeholder='password' id='password' onChange={(e) => setPassword(e.target.value)}/>
        {/* login button triggers login() */}
        <button type='button' className='login-button' onClick={login}>login</button>
        <p className='message'>{error instanceof Error ? error.message : String(error)}</p>
      </form>
    </div>
  </div>
}
