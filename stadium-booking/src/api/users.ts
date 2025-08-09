import { api } from './client';
import type { User } from '../types';

const resource = '/users';

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const { data } = await api.post<User>(resource, user);
  return data;
}

export async function findUserByPhone(phoneNumber: string): Promise<User | null> {
  const { data } = await api.get<User[]>(`${resource}?phoneNumber=${encodeURIComponent(phoneNumber)}`);
  return data.length ? data[0] : null;
}

export async function getUsersMap(): Promise<Record<string, User>> {
  const { data } = await api.get<User[]>(resource);
  return data.reduce<Record<string, User>>((acc, u) => {
    acc[u.id] = u;
    return acc;
  }, {});
}