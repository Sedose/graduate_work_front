/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { makeAutoObservable } from 'mobx';
import { UserRole } from '../types';

class UserDetailsStore {
  userRole: UserRole = '';

  userEmail: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setUserRole(userRole: UserRole) {
    this.userRole = userRole;
  }

  setUserEmail(userEmail: string) {
    this.userEmail = userEmail;
  }

  clearAll() {
    this.userRole = '';
    this.userEmail = '';
  }
}

export default new UserDetailsStore();
