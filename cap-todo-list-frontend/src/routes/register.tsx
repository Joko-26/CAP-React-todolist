import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
    const [username, setUsername] = useState<string>(String);
    const [password, setPassword] = useState<string>(String);
    const [current_password, setCurrentPassword] = useState<string>(String);
    const [message, setMessage] = useState<string>(String);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const navigate = useNavigate();
  // validates registration ing
  const register = async  () => {
    
    const data = { username, password }
    try {
      const answer = await fetch("http://localhost:4004/browse/register", {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      // make result (user Id) usable
      const jsonResult = await answer.text();
      const value = JSON.parse(jsonResult).value;
      setResult(value);

      // Pass userId as a search param
      // go to /todolist if answer is ok
      navigate({ to: '/todolist', search: { userId: value } });
      // set error if there is an error
    } catch (error) {
      setError(error)
    }
  }

  // checks if both passwords are the same
  const confirm_password = (new_password: string) => {
    if (new_password !== current_password) {
      setMessage('Passwords have to match')
    }
    else {
      setMessage('')
      setPassword(current_password)
    }
  }

  return <div>
    <button className='back-button' onClick={() => navigate({ to: '/' })}> ⬅️ Back </button>
    <div className="center-container">
      <form className='form-box'>
        <h1>Create Account</h1>
        {/* sets password and username and validates that both passwords are the same */}
        <input type="text" placeholder='username' id='username' onChange={(e) => setUsername(e.target.value)}/>
        <input type="password" placeholder='password' id='password' onChange={(e) => setCurrentPassword(e.target.value)}/>
        <input type="password" placeholder='confirm password' id='confirm-password' onChange={(e) => confirm_password(e.target.value)}/>
        {/* displays message if passwords aren't the same */}
        <h4 className='message'>{ message }</h4>
        {/* triggers register() */}
        <button type='button' className='register-button' onClick={register}>create account</button>
        {/* displays error message */}
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </form>
    </div>
  </div>
}
