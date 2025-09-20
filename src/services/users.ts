// src/services/users.ts
import { dummyUsers, type User } from "../data/dummyUsers";

export const fetchAllUsers = async (): Promise<User[]> => {
  return dummyUsers;
};

export const fetchUserById = async (id: string): Promise<User | undefined> => {
  return dummyUsers.find((u) => u.id === id);
};
