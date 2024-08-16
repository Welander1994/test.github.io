import { defineStore } from 'pinia'
import { ref, computed} from 'vue'

export const useTest = defineStore("test", () => {

    const test = "testinfg";

    return {test};
  });