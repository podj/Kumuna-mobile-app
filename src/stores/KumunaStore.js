import { action, observable, makeObservable, runInAction } from "mobx";
import Toast from "react-native-toast-message";
import * as backendService from "../services/backendService";

class KumunaStore {
  expenses = [];
  members = {};
  kumunaId = null;
  loadingExpenses = false;
  loadingMembers = false;
  isLoading = false;
  userBalance = null;

  constructor() {
    makeObservable(this, {
      expenses: observable,
      loadingExpenses: observable,
      loadingMembers: observable,
      isLoading: observable,
      members: observable,
      kumunaId: observable,
      userBalance: observable,
      loadExpenses: action.bound,
      loadMembers: action.bound,
      setKumunaId: action.bound,
      addExpense: action.bound,
      deleteExpense: action.bound,
    });
  }

  async loadMembers() {
    runInAction(() => (this.loadingMembers = true));
    const kumunaMembers = await backendService.getKumunaMembers(this.kumunaId);
    const memberIdToMember = kumunaMembers.reduce(
      (members, member) => ((members[member.user.id] = member.user), members),
      {}
    );
    runInAction(() => {
      this.members = memberIdToMember;
      this.loadingMembers = false;
    });
  }

  async refreshExpenses(onlySetteled = false) {
    runInAction(() => (this.isLoading = true));
    await this.loadExpenses(onlySetteled);
    runInAction(() => (this.isLoading = false));
  }

  async loadExpenses(onlySetteled = false) {
    runInAction(() => (this.loadingExpenses = true));
    try {
      const expenses = await backendService.getKumunaExpenses(
        this.kumunaId,
        onlySetteled
      );
      this.parseExpenses(expenses.expenses);
      runInAction(() => {
        this.expenses = expenses.expenses;
        this.userBalance = expenses.currentUserBalance;
      });
    } catch (e) {
      Toast.show({
        text1: "Oops",
        text2: "Huston, we have a problem",
        type: "error",
      });
      runInAction(() => {
        this.expenses = [];
        this.userBalance = null;
      });
    } finally {
      runInAction(() => (this.loadingExpenses = false));
    }
  }

  parseExpenses = (expenses) => {
    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];
      expense.debtors = [];
      expense.creditor = this.members[expense.creditorId];
      for (let j = 0; j < expense.debts.length; j++) {
        expense.debtors.push(this.members[expense.debts[j].debtorId]);
      }

      expense.createdTime = new Date(expense.createdTime);
      expense.date = new Date(expense.date);
    }
  };

  async setKumunaId(kumunaId) {
    runInAction(() => {
      this.kumunaId = kumunaId;
      this.isLoading = true;
    });
    await this.loadMembers();
    await this.loadExpenses();
    runInAction(() => (this.isLoading = false));
  }

  async addExpense(expense) {
    runInAction(() => {
      this.isLoading = true;
    });
    await backendService.createExpense(expense);
    await this.loadExpenses();
    runInAction(() => (this.isLoading = false));
  }

  async deleteExpense(expense) {
    runInAction(() => {
      this.isLoading = true;
    });

    await backendService.deleteExpense(expense);
    await this.loadExpenses();

    runInAction(() => {
      this.isLoading = false;
    });
  }
}

export default new KumunaStore();
