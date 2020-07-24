import React, { createContext } from 'react'
import { UserDetailsType } from '../user/UserContext'

import { Action } from './FriendsReducer'

export interface FriendsState {
  friends: UserDetailsType[];
  incomingRequests: UserDetailsType[];
  sentRequests: UserDetailsType[];
}

export type FriendsContextType = {
  friendsState: FriendsState;
  friendsDispatch: React.Dispatch<Action>;
}

const FriendsContext = createContext<Partial<FriendsContextType>>({})

export { FriendsContext }
