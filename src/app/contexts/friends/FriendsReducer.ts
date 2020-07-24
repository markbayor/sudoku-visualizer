import { FriendsState } from './FriendsContext'
import { UserDetailsType } from '../user/UserContext'

export const initialFriendsState: FriendsState = {
  friends: [],
  incomingRequests: [],
  sentRequests: []
}

type getFriendsAction = { type: 'GET_FRIENDS'; friends: UserDetailsType[] }
type deleteFriendAction = { type: 'DELETE_FRIEND'; friendId: string }
type sendRequestAction = { type: 'SEND_REQUEST'; request: UserDetailsType }
type getRequestsAction = { type: 'GET_REQUESTS'; incomingRequests: UserDetailsType[]; sentRequests: UserDetailsType[] }
type acceptRequestAction = { type: 'ACCEPT_REQUEST'; friend: UserDetailsType }
type rejectRequestAction = { type: 'REJECT_REQUEST'; requesterId: string }
type cancelRequestAction = { type: 'CANCEL_REQUEST'; friendId: string }
type emptyStateAction = { type: 'EMPTY_STATE' }

export type Action = getFriendsAction | deleteFriendAction | sendRequestAction | getRequestsAction | acceptRequestAction | rejectRequestAction | cancelRequestAction | emptyStateAction

export function friendsReducer(state: FriendsState, action: Action): FriendsState {
  let newState: FriendsState = { ...state }
  switch (action.type) {
    case 'EMPTY_STATE':
      newState = initialFriendsState
      return newState
    case 'GET_FRIENDS':
      newState.friends = action.friends
      return newState

    case 'DELETE_FRIEND':
      newState.friends = newState.friends.filter(friend => friend.id !== action.friendId)
      return newState

    case 'SEND_REQUEST':
      newState.sentRequests = [...newState.sentRequests, action.request]
      return newState

    case 'GET_REQUESTS':
      newState.incomingRequests = action.incomingRequests
      newState.sentRequests = action.sentRequests
      return newState

    case 'ACCEPT_REQUEST':
      newState.friends = [...newState.friends, action.friend]
      newState.incomingRequests = newState.incomingRequests.filter(request => request.id !== action.friend.id)
      return newState

    case 'REJECT_REQUEST':
      newState.incomingRequests = newState.incomingRequests.filter(request => request.id !== action.requesterId)
      return newState

    case 'CANCEL_REQUEST':
      newState.sentRequests = newState.sentRequests.filter(request => request.id !== action.friendId)
      return newState

    default:
      return newState
  }
}