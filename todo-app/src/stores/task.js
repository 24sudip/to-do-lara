import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
import { allTask } from "@/http/task-api";

const tmp = {
  state: () => ({
    
  }),
  getters: {
    
  },
  actions: {
    
  },
};

export const useTaskStore = defineStore("taskStore", () => {
    const tasks = ref([]);
    
    const uncompletedTask = computed(() =>
      tasks.value.filter((task) => !task.is_completed)
    );
    const completedTask = computed(() =>
      tasks.value.filter((task) => task.is_completed)
    );
    const fetchAllTask = async () => {
      const { data } = await allTask();
      tasks.value = data.data;
    };
    return {
        tasks, completedTask, uncompletedTask, fetchAllTask
    }
});
