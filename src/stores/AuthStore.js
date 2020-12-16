import { action, computed, observable, makeObservable, get } from "mobx";

class AuthStore {
  user = null;
  isLoading = true;

  constructor() {
    makeObservable(this, {
      user: observable,
      isLoading: observable,
      isLoggedIn: computed,
      setUser: action,
    });
  }

  setUser = (user) => {
    this.user = user;
    this.isLoading = false;
  };

  get isLoggedIn() {
    return !!this.user;
  }
}

export default new AuthStore();
