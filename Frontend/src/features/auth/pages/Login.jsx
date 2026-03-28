import React from 'react'
import "../auth.form.scss";
import { useNavigate, Link } from 'react-router' 
import { useAuth } from '../hook/userAuth'


const Login = () => {

  const { loading, handleLogin } = useAuth();
  // const navigate = useNavigate()
  // useAuth = hsurihjf()


  // do it's your self...

  const [first, setfirst] = useState(second)


  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor='email'>Email</label>
            <input type="email" id='email' name='email' placeholder='Enter your email' />
          </div>

          <div className="input-group">
            <label htmlFor='password'>Password</label>
            <input type="password" id='password' name='password' placeholder='Enter your password' />
          </div>

          <button type="submit" className='button primary-button' >Login</button>

        </form>

        <p>Don't have an account? <Link to={'/register'} >Register</Link></p>

      </div>
    </main>
  )
}


export default Login