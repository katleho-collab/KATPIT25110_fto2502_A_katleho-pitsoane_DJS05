/**
 * @typedef PodcastPreview
 * @property {string} id - Unique ID of the podcast.
 * @property {string} title - Title of the podcast.
 * @property {string} image - URL of the podcast image.
 * @property {number} seasons - Number of seasons available.
 * @property {string} updated - ISO date string for the last update.
 * @property {number[]} genres - Array of genre IDs.
 */

/**
 * @typedef Episode
 * @property {string} title - Title of the episode.
 * @property {string} description - Description of the episode.
 * @property {string} file - URL to the episode audio file.
 */

/**
 * @typedef Season
 * @property {number} season - Season number.
 * @property {string} title - Title of the season.
 * @property {string} image - URL to the season image.
 * @property {Episode[]} episodes - Array of episode objects.
 */

/**
 * @typedef PodcastShow
 * @property {string} id - Unique ID of the podcast.
 * @property {string} title - Title of the podcast.
 * @property {string} description - Full description of the podcast.
 * @property {string} image - URL of the podcast image.
 * @property {string} updated - ISO date string for the last update.
 * @property {number[]} genres - Array of genre IDs.
 * @property {Season[]} seasons - Array of season objects.
 */

/**
 * @function fetchPodcasts
 * Asynchronously fetches podcast preview data from the remote API and updates state accordingly.
 * Handles loading, error, and successful data response via provided state setters.
 *
 * @param {Function} setPodcasts - State setter function to update the podcasts array.
 * @param {Function} setError - State setter function to update the error message (string).
 * @param {Function} setLoading - State setter function to toggle the loading state (boolean).
 *
 * @returns {Promise<void>} A promise that resolves when the fetch process completes.
 **/
export async function fetchPodcasts(setPodcasts, setError, setLoading) {
  try {
    const res = await fetch("https://podcast-api.netlify.app/shows")
    if (!res.ok) throw new Error(`${res.status}`)
    const data = await res.json()
    setPodcasts(data)
  } catch (err) {
    console.error("Failed to fetch podcasts:", err)
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

/**
 * @function fetchShowDetails
 * Asynchronously fetches detailed information for a single podcast show by its ID.
 * Handles loading, error, and successful data response.
 *
 * @param {string} showId - The unique ID of the podcast show to fetch.
 * @param {Function} setLoading - State setter function to toggle the loading state (boolean).
 * @param {Function} setError - State setter function to update the error message (string).
 * @returns {Promise<PodcastShow | null>} A promise that resolves with the podcast show data or null if an error occurs.
 */
export async function fetchShowDetails(showId, setLoading, setError) {
  setLoading(true)
  setError(null)
  try {
    const res = await fetch(`https://podcast-api.netlify.app/id/${showId}`)
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Show not found.")
      }
      throw new Error(`Failed to fetch show details: ${res.status}`)
    }
    const data = await res.json()
    return data
  } catch (err) {
    console.error(`Failed to fetch show ${showId} details:`, err)
    setError(err.message)
    return null
  } finally {
    setLoading(false)
  }
}