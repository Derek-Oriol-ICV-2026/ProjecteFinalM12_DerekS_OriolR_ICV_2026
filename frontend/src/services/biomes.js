import api from './api'

let biomesCache = null

export const biomeService = {
  getAllBiomes: async () => {
    try {
      if (biomesCache) return biomesCache

      const response = await api.get('/biomes')
      biomesCache = response.data
      return biomesCache
    } catch (error) {
      console.error('Error fetching biomes:', error)
      return []
    }
  },

  getBiomeById: async (id) => {
    try {
      const allBiomes = await biomeService.getAllBiomes()
      return allBiomes.find(biome => biome._id === id)
    } catch (error) {
      console.error('Error finding biome:', error)
      return null
    }
  },

  clearCache: () => {
    biomesCache = null
  },

  createBiome: async (biomeData) => {
    try {
      const response = await api.post('/biomes', biomeData)
      biomesCache = null // Limpiar cache
      return response.data
    } catch (error) {
      console.error('Error creating biome:', error)
      return null
    }
  },

  updateBiome: async (id, biomeData) => {
    try {
      const response = await api.put(`/biomes/${id}`, biomeData)
      biomesCache = null // Limpiar cache
      return response.data
    } catch (error) {
      console.error('Error updating biome:', error)
      return null
    }
  },

  deleteBiome: async (id) => {
    try {
      const response = await api.delete(`/biomes/${id}`)
      biomesCache = null // Limpiar cache
      return response.data
    } catch (error) {
      console.error('Error deleting biome:', error)
      return null
    }
  }
}