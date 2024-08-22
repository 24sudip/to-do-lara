<template>
    <main style="min-height: 50vh; margin-top: 2rem;">
        <div class="container">
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    <!-- Add new Task -->
                    <NewTask @added="handleAddedTask" />
                    <!-- List of uncompleted tasks -->
                    <Tasks :tasks="uncompletedTask" 
                        @updated="handleUpdatedTask" 
                        @completed="handleCompletedTask"
                        @removed="handleRemovedTask" 
                    />
                    <!-- show toggle button -->
                     <div class="text-center my-3" v-show="showToggleCompletedBtn">
                        <button class="btn btn-sm btn-secondary" @click="$event => showCompletedTask = !showCompletedTask">
                            <span v-if="!showCompletedTask">Show Completed</span>
                            <span v-else>Hide Completed</span>
                        </button>
                     </div>
                    <!-- List of completed tasks -->
                    <Tasks :tasks="completedTask" 
                        :show="completedTaskIsVisible && showCompletedTask"
                        @updated="handleUpdatedTask" 
                        @completed="handleCompletedTask"
                        @removed="handleRemovedTask" 
                    />
                </div>
            </div>
        </div>
    </main>
</template>
<script setup>
    import { computed, onMounted, ref } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useTaskStore } from '@/stores/task';
    import { allTask, createTask, updateTask, completeTask, removeTask } from '@/http/task-api';
    import Tasks from '@/components/tasks/Tasks.vue';
    import NewTask from '@/components/tasks/NewTask.vue';

    const store = useTaskStore();
    const { completedTask, uncompletedTask } = storeToRefs(store);
    const { fetchAllTask } = store;

    const tasks = ref([]);
    onMounted(async () => {
        await fetchAllTask();
    });
    
    const showToggleCompletedBtn = computed(() => uncompletedTask.value.length > 0 && completedTask.value.length > 0);
    const completedTaskIsVisible = computed(() => uncompletedTask.value.length === 0 || completedTask.value.length > 0);
    const showCompletedTask = ref(false);
    const handleAddedTask = async (newTask) => {
        const { data: createdTask } = await createTask(newTask);
        tasks.value.unshift(createdTask.data);
    };
    const handleUpdatedTask = async (task) => {
        const { data: updatedTask } = await updateTask(task.id, {
            name: task.name
        });
        const currentTask = tasks.value.find(item => item.id === task.id);
        currentTask.name = updatedTask.data.name;
    };
    const handleCompletedTask = async (task) => {
        const { data: updatedTask } = await completeTask(task.id, {
            is_completed: task.is_completed
        });
        const currentTask = tasks.value.find(item => item.id === task.id);
        currentTask.is_completed = updatedTask.data.is_completed;
    };
    const handleRemovedTask = async (task) => {
        await removeTask(task.id);
        const index = tasks.value.findIndex(item => item.id === task.id);
        tasks.value.splice(index, 1);
    }
</script>
