<template>
    <li class="list-group-item py-3">
        <div class="d-flex justify-content-start align-items-center">
            <input class="form-check-input mt-0" 
            type="checkbox" 
            :class="completedClass" 
            :checked="task.is_completed"
            @change="markTaskAsCompleted" />
            <div class="ms-2 flex-grow-1" :class="completedClass" title="Double click the text to edit or remove"
            @dblclick="$event => isEdit = true">
                <div class="relative" v-if="isEdit">
                    <input class="editable-task" type="text" 
                    v-focus 
                    @keyup.esc="undo" 
                    @keyup.enter="update_task" v-model="editingTask" />
                </div>
                <span v-else>{{ task.name }}</span>
            </div>
            <!-- <div class="task-date">24 Feb 12:00</div> -->
        </div>
        <TaskAction 
            @edit="$event => isEdit = true" v-show="!isEdit"
            @remove="remove_task" 
        />
    </li>
</template>
<script setup>
    import { computed, ref } from 'vue';
    import TaskAction from './TaskAction.vue';
    // import { updateTask } from '@/http/task-api';
    const props = defineProps({
        task: Object
    });
    const emit = defineEmits(['updated', 'completed', 'removed']);
    const isEdit = ref(false);
    const editingTask = ref(props.task.name);
    const completedClass = computed(() => props.task.is_completed ? "completed" : "");
    const vFocus = {
        mounted: (el) => el.focus()
    };
    const update_task = event => {
        const updatedTask = { ...props.task, name: event.target.value };
        isEdit.value = false;
        emit('updated', updatedTask);
    };
    const markTaskAsCompleted = event => {
        const updatedTask = { ...props.task, is_completed: !props.task.is_completed };
        emit('completed', updatedTask);
    };
    const remove_task = () => {
        if (confirm("Are You Sure?")) {
            emit('removed', props.task);
        }
    };
    const undo = () => {
        isEdit.value = false;
        editingTask.value = props.task.name;
    };
</script>
