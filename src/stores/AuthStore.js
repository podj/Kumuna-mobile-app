import {
  action,
  computed,
  observable,
  makeObservable,
  runInAction,
} from "mobx";
import * as Updates from "expo-updates";

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

  setUser = async (user) => {
    runInAction(() => {
      this.user = user;
    });
    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (isAvailable) {
        await Updates.fetchUpdateAsync();
        Updates.reloadAsync();
      }
    } catch (e) {
      console.log("Got an error when trying to update app");
    }
    runInAction(() => ((this.isLoading = false)));
  };

  get isLoggedIn() {
    return !!this.user;
  }
}

export default new AuthStore();
