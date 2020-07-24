import { HttpRequest } from "../../../utils";
import { useHistory } from 'react-router-dom'
import React, { useContext, useState, useEffect } from "react";
import { UserContext, UserDetailsType } from "../../contexts/user/UserContext";

const RegisterForm = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleOnSubmit = async () => {
    setLoading(true)
    try {
      const { status, data } = await HttpRequest(`${process.env.SERVER_URL || 'http://localhost:8080'}/auth/register`, 'POST', {
        body: {
          name: username,
          email,
          password,
        },
      })

      if (status === 201 && data) {
        setMessage('Success! Confirm your email to log in')
        setTimeout(() => setMessage(''), 3000)
        history.push('/')
      }
    } catch (ex) {
      console.log(ex)
    }

    setLoading(false)
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleOnSubmit}>
        <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <input placeholder='avatarUrl' />
        <button type='submit'>Register</button>
        {loading && <h2>Working...</h2>}
        {message && <h2>{message}</h2>}
      </form>
    </div>
  );
};

export { RegisterForm }