/**
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {object} Task
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 * @property {Priority} priority
 * @property {number} createdAt
 * @property {number | undefined} completedAt
 */

/**
 * @typedef {object} TaskFormData
 * @property {string} text
 * @property {Priority} priority
 */