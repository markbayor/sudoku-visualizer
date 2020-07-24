import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../../contexts/user/UserContext'
import { removeJwt } from '../../../utils'
import { FriendsContext } from '../../contexts/friends/FriendsContext'
import { SudokusContext } from '../../contexts/sudokus/SudokusContext'

import './NavBar.scss'

const Navbar = () => {

  const { user, setUser } = useContext(UserContext)
  const { friendsDispatch } = useContext(FriendsContext)
  const { sudokusDispatch } = useContext(SudokusContext)

  const history = useHistory()

  const handleLogout = () => {
    removeJwt()
    if (setUser && friendsDispatch && sudokusDispatch) {
      setUser(undefined)
      friendsDispatch({ type: 'EMPTY_STATE' })
      sudokusDispatch({ type: 'EMPTY_STATE' })
      history.push('/')
    }
  }

  const refreshPage = () => {
    window.location.reload(false);
  }

  return (
    <header className='navbar-container'>
      <h1 onClick={refreshPage}>Sudoku visualizer!</h1>
      {/* <Link to='/'>Home</Link>
      <Link to='/play'>Play / Visualize</Link>
      <div>
        {user && <Link to='/auth'>Sign in or sign up</Link>}
        {!user && <button onClick={handleLogout}>Log out</button>}
      </div> */}
    </header>
  )
}

export { Navbar }