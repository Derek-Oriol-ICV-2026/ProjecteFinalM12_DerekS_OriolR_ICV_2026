import api from './api'

let resourcesCache = null

export const resourceService = {

    getAllResources: async () => {
    try {
      if (resourcesCache) return resourcesCache

      const response = await api.get('/resources')
      resourcesCache = response.data
      return resourcesCache
    } catch (error) {
      console.error('Error fetching resources:', error)
      return []
    }
  },

  getResourcesByType: async (type) => {
    try {
      const allResources = await resourceService.getAllResources()
      return allResources.filter(resource => resource.type === type)
    } catch (error) {
      console.error(`Error filtering ${type}:`, error)
      return []
    }
  },

  getResourceById: async (id) => {
    try {
      const allResources = await resourceService.getAllResources()
      return allResources.find(resource => resource._id === id)
    } catch (error) {
      console.error('Error finding resource:', error)
      return null
    }
  },

  clearCache: () => {
    resourcesCache = null
  },

  createResource: async (resourceData) => {
    try {
      const response = await api.post('/resources', resourceData)
      resourcesCache = null // Limpiar cache
      return response.data
    } catch (error) {
      console.error('Error creating resource:', error)
      return null
    }
  },

  updateResource: async (id, resourceData) => {
    try {
      const response = await api.put(`/resources/${id}`, resourceData)
      resourcesCache = null // Limpiar cache
      return response.data
    } catch (error) {
      console.error('Error updating resource:', error)
      return null
    }
  },

  deleteResource: async (id) => {
    try {
      const response = await api.delete(`/resources/${id}`)
      resourcesCache = null // Limpiar cache
      return response.data
    } catch (error) {
      console.error('Error deleting resource:', error)
      return null
    }
  }
}