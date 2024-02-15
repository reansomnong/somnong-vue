import { defineStore } from 'pinia';
interface MessageStore {
  errors: string[];
  message: string;
  show: boolean;
}

export const useMessageStore = defineStore({
  id: 'MessageStore',
  state: (): MessageStore => ({
    errors: [],
    message: '',
    show: false,
  }),
  getters: {
    getInsert(): string {
      return 'Record has been saved successfully';
    },
    getUpdate(): string {
        return 'Record has been updated successfully';
    },
    getDelete(): string {
        return 'Record has been deleted successfully';
    },
    getCharge(): string {
      return 'Payment process has been completed';
  },
    getErrors(): string[] {
      return this.errors;
    },
    getShowStatus(): boolean {
      return this.show;
    },
  },
  actions: {
    setMessage(message: string) {
      if (message) {
        this.message = message;
        this.show = true;
      }
    },
    setErrors(errors: string[]) {
      if (errors) {
        this.errors = errors;
        this.show = true;
      }
    },
    clearAlert() {
      this.errors = [];
      (this.message = ''), (this.show = false);
    },
  },
});
