import Vue from 'vue'
import { uid, LocalStorage } from 'quasar'

const state = {
	tasks: {
		'ID1': {
			name: 'Go to work',
			completed: true,
			dueDate: '2024/06/29',
			dueTime: '18:30'
		},
		'ID2': {
			name: 'Go to home',
			completed: false,
			dueDate: '2024/06/28',
			dueTime: '14:00'
		},
		'ID3': {
			name: 'Go to bed',
			completed: false,
			dueDate: '2024/06/30',
			dueTime: '16:00'
		}
	},
	search: '',
	sort: 'name'
}

const mutations = {
	updateTask(state, payload) {
		Object.assign(state.tasks[payload.id], payload.updates)
	},
	deleteTask(state, id) {
		Vue.delete(state.tasks, id)
	},
	addTask(state, payload) {
		Vue.set(state.tasks, payload.id, payload.task)
	},
	setTasks(state, tasks) {
		state.tasks = tasks
	},
	setSearch(state, value) {
		state.search = value
	},	
	setSort(state, value) {
		state.sort = value
	}
}

const actions = {
	updateTask({ commit, dispatch }, payload) {
		commit('updateTask', payload)
		dispatch('saveTasks')
	},
	deleteTask({ commit, dispatch }, id) {
		commit('deleteTask', id)
		dispatch('saveTasks')
	},
	addTask({ commit, dispatch }, task) {
		let taskId = uid()
		let payload = {
			id: taskId,
			task: task
		}
		commit('addTask', payload)
		dispatch('saveTasks')
	},
	saveTasks({ state }) {
		LocalStorage.set('tasks', state.tasks)
	},
	getTasks({ commit }) {
		let tasks = LocalStorage.getItem('tasks')
		if (tasks) {
			commit('setTasks', tasks)
		}
	},
	setSearch({ commit }, value) {
		commit('setSearch', value)
	},
	setSort({ commit }, value) {
		commit('setSort', value)
	}
}

const getters = {
	tasksSorted: (state) => {
		let tasksSorted = {},
				keysOrdered = Object.keys(state.tasks)

		keysOrdered.sort((a, b) => {
			let taskAProp = state.tasks[a][state.sort].toLowerCase(),
					taskBProp = state.tasks[b][state.sort].toLowerCase()
			
			if (taskAProp > taskBProp) return 1
			else if (taskAProp < taskBProp) return -1
			else return 0
		})

		keysOrdered.forEach((key) => {
			tasksSorted[key] = state.tasks[key]
		})

		return tasksSorted
	},
	tasksFiltered: (state, getters) => {
		let tasksSorted = getters.tasksSorted,
				tasksFiltered = {}
		if (state.search) {
			Object.keys(tasksSorted).forEach(function(key) {
				let task = tasksSorted[key],
						taskNameLowerCase = task.name.toLowerCase(),
						searchLowerCase = state.search.toLowerCase()
				if (taskNameLowerCase.includes(searchLowerCase)) {
					tasksFiltered[key] = task
				}
			})
			return tasksFiltered
		}
		return tasksSorted
	},
	tasksTodo: (state, getters) => {
		let tasksFiltered = getters.tasksFiltered
		let tasks = {}
		Object.keys(tasksFiltered).forEach(function(key) {
			let task = tasksFiltered[key]
			if (!task.completed) {
				tasks[key] = task
			}
		})
		return tasks
	},
	tasksCompleted: (state, getters) => {
		let tasksFiltered = getters.tasksFiltered
		let tasks = {}
		Object.keys(tasksFiltered).forEach(function(key) {
			let task = tasksFiltered[key]
			if (task.completed) {
				tasks[key] = task
			}
		})
		return tasks
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
