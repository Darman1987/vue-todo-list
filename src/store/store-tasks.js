import Vue from 'vue'
import { uid, LocalStorage } from 'quasar'

const TASK_NOTIFICATION_HISTORY_KEY = 'taskNotificationHistory'
const PRODUCTION_NOTIFICATION_HOST = 'darman1987.github.io'
const PRODUCTION_NOTIFICATION_PATH_PREFIX = '/vue-todo-list'
const DEVELOPMENT_NOTIFICATION_HOSTS = ['localhost', '127.0.0.1']
const notificationTimers = {}

function isAllowedNotificationOrigin() {
	if (typeof window === 'undefined') return false

	let { hostname, pathname } = window.location
	let isProductionOrigin =
		hostname === PRODUCTION_NOTIFICATION_HOST &&
		pathname.startsWith(PRODUCTION_NOTIFICATION_PATH_PREFIX)
	let isDevelopmentOrigin = DEVELOPMENT_NOTIFICATION_HOSTS.includes(hostname)

	return isProductionOrigin || isDevelopmentOrigin
}

function isNotificationsSupported() {
	return (
		typeof window !== 'undefined' &&
		'Notification' in window &&
		isAllowedNotificationOrigin()
	)
}

function getTaskDueTimestamp(task) {
	if (!task || !task.dueDate) return null

	let [year, month, day] = task.dueDate.split('/').map(Number)
	let [hours, minutes] = (task.dueTime || '00:00').split(':').map(Number)

	if (
		Number.isNaN(year) ||
		Number.isNaN(month) ||
		Number.isNaN(day) ||
		Number.isNaN(hours) ||
		Number.isNaN(minutes)
	) {
		return null
	}

	return new Date(year, month - 1, day, hours, minutes, 0, 0).getTime()
}

function getNotificationEventKey(task) {
	return `${task.dueDate || ''}|${task.dueTime || ''}`
}

function getNotificationHistory() {
	return LocalStorage.getItem(TASK_NOTIFICATION_HISTORY_KEY) || {}
}

function hasTaskNotificationBeenSent(id, task) {
	let history = getNotificationHistory()
	return history[id] === getNotificationEventKey(task)
}

function markTaskNotificationAsSent(id, task) {
	let history = getNotificationHistory()
	history[id] = getNotificationEventKey(task)
	LocalStorage.set(TASK_NOTIFICATION_HISTORY_KEY, history)
}

function clearTaskNotificationTimer(id) {
	if (notificationTimers[id]) {
		clearTimeout(notificationTimers[id])
		delete notificationTimers[id]
	}
}

function showTaskNotification(task) {
	new Notification('Task due', {
		body: task.name || 'A pending task is due now.'
	})
}

function scheduleTaskNotification(id, task) {
	clearTaskNotificationTimer(id)

	if (!isNotificationsSupported()) return
	if (Notification.permission !== 'granted') return
	if (!task || task.completed || !task.dueDate) return

	let dueTimestamp = getTaskDueTimestamp(task)
	if (dueTimestamp === null) return

	if (hasTaskNotificationBeenSent(id, task)) return

	let delay = dueTimestamp - Date.now()

	if (delay <= 0) {
		showTaskNotification(task)
		markTaskNotificationAsSent(id, task)
		return
	}

	notificationTimers[id] = setTimeout(() => {
		showTaskNotification(task)
		markTaskNotificationAsSent(id, task)
		clearTaskNotificationTimer(id)
	}, delay)
}

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
	async ensureNotificationPermission() {
		if (!isNotificationsSupported()) return
		if (Notification.permission !== 'default') return
		try {
			await Notification.requestPermission()
		} catch (error) {
			// Ignore permission prompt errors and continue app flow.
		}
	},
	syncTaskNotifications({ state }) {
		Object.keys(notificationTimers).forEach((id) => clearTaskNotificationTimer(id))
		Object.keys(state.tasks).forEach((id) => {
			scheduleTaskNotification(id, state.tasks[id])
		})
	},
	async updateTask({ commit, dispatch }, payload) {
		await dispatch('ensureNotificationPermission')
		commit('updateTask', payload)
		dispatch('saveTasks')
		dispatch('syncTaskNotifications')
	},
	deleteTask({ commit, dispatch }, id) {
		commit('deleteTask', id)
		dispatch('saveTasks')
		dispatch('syncTaskNotifications')
	},
	async addTask({ commit, dispatch }, task) {
		await dispatch('ensureNotificationPermission')
		let taskId = uid()
		let payload = {
			id: taskId,
			task: task
		}
		commit('addTask', payload)
		dispatch('saveTasks')
		dispatch('syncTaskNotifications')
	},
	saveTasks({ state }) {
		LocalStorage.set('tasks', state.tasks)
	},
	async getTasks({ commit, dispatch }) {
		await dispatch('ensureNotificationPermission')
		let tasks = LocalStorage.getItem('tasks')
		if (tasks) {
			commit('setTasks', tasks)
		}
		dispatch('syncTaskNotifications')
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
