import { setJwt } from "../../../utils";
import { HttpRequest } from "../../../utils";
import { useHistory } from 'react-router-dom'
import React, { useState } from "react";


const SigninForm = () => {

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  const [message, setMessage] = useState('')

  const handleOnSubmit = async () => {
    setLoading(true)
    try {
      const { data: { token } } = await HttpRequest(`${process.env.SERVER_URL || 'http://localhost:8080'}/auth/signin`, 'POST', {
        body: {
          email,
          password,
        },
      })
      setJwt(token)
      setMessage('Success!')
      setTimeout(() => setMessage(''), 3000)
      history.push('/')
    } catch (ex) {
      console.log(ex)
      setMessage(ex)
      setTimeout(() => setMessage(''), 3000)
    }
    setLoading(false)
  }

  return (
    <div>
      <h2>Sign in</h2>
      <form onSubmit={handleOnSubmit}>
        <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type='submit'>Sign in</button>
      </form>
      {loading && <h2>Working...</h2>}
      {message && <h2>{message}</h2>}
    </div>
  );
};

export { SigninForm }