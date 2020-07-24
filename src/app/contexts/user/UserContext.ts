import { createContext } from "react";

export interface UserDetailsType {
  id: string;
  name: string;
  email: string;
}

type UserContextType = {
  user: UserDetailsType;
  setUser: (newUser: UserDetailsType | undefined) => void;
};

export const UserContext = createContext<Partial<UserContextType>>({});
