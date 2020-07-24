import ReactDOM from "react-dom";
import React, { useEffect, useState, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";

import { getUser, getJwt } from "./utils";
import { FriendsContext } from "./app/contexts/friends/FriendsContext";
import { SudokusContext } from "./app/contexts/sudokus/SudokusContext";
import { UserContext, UserDetailsType } from "./app/contexts/user/UserContext";
import { friendsReducer, initialFriendsState } from "./app/contexts/friends/FriendsReducer";
import { sudokusReducer, initialSudokusState } from "./app/contexts/sudokus/SudokusReducer";

import { HomePage } from "./app/pages/HomePage/HomePage";
import { GamePage } from "./app/pages/GamePage/GamePage";
import { AuthPage } from "./app/pages/AuthPage/AuthPage";
import { Navbar } from "./app/components/NavBar/Navbar";

interface IRegisterResponse {
  id: string;
  name: string;
  email: string;
  password: string;
  dob: Date | string;
}

const App = () => {
  const [user, setUser] = useState({} as UserDetailsType | undefined)

  const [sudokusState, sudokusDispatch] = useReducer(sudokusReducer, initialSudokusState)
  const [friendsState, friendsDispatch] = useReducer(friendsReducer, initialFriendsState)

  useEffect(() => {
    const initalFetch = async () => {
      if (getJwt()) {
        const user: UserDetailsType = await getUser()
        setUser(user)
      }
    }
    initalFetch()
  }, [])


  return (
    <Router>
      <div className="app-container">
        <UserContext.Provider value={{ user, setUser }}>
          <FriendsContext.Provider value={{ friendsState, friendsDispatch }}>
            <SudokusContext.Provider value={{ sudokusState, sudokusDispatch }}>
              <Navbar />
              <Switch>
                {/* <Route exact path='/' component={HomePage} /> */}
                <Route exact path='/' component={GamePage} />
                {/* <Route exact path='/auth' component={AuthPage} /> */}
              </Switch>
            </SudokusContext.Provider>
          </FriendsContext.Provider>
        </UserContext.Provider>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
