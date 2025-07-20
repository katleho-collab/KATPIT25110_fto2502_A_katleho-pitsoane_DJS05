"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { fetchShowDetails } from "../api/fetchPodcasts" // Import the new fetch function
import { formatDate } from "../utils/formatDate"
import styles from "./ShowDetailPage.module.css" // New CSS module

/**
 * ShowDetailPage component displays comprehensive details for a specific podcast show,
 * including its description, genres, seasons, and episodes. It also provides
 * navigation to switch between seasons.
 *
 * @param {Object} props
 * @param {Array<Object>} props.genres - Array of all available genre objects for mapping IDs to titles.
 * @returns {JSX.Element} The rendered show detail page.
 */
export default function ShowDetailPage({ genres: allGenres }) {
  const { id } = useParams() // Get the show ID from the URL
  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0) // Default to first season

  useEffect(() => {
    /**
     * Fetches show details when the component mounts or the ID changes.
     * @async
     * @function loadShowDetails
     */
    const loadShowDetails = async () => {
      const data = await fetchShowDetails(id, setLoading, setError)
      if (data) {
        setShow(data)
        // Ensure selectedSeasonIndex is valid if show data changes
        if (data.seasons && data.seasons.length > 0) {
          setSelectedSeasonIndex(0) // Reset to first season on new show load
        }
      }
    }
    loadShowDetails()
  }, [id]) // Re-fetch if the show ID in the URL changes

  /**
   * Maps genre IDs to their titles for display.
   * @type {JSX.Element[]}
   */
  const genreTags = useMemo(() => {
    if (!show || !show.genres) return []
    return show.genres.map((genreId) => {
      const genreMatch = allGenres.find((g) => g.id === genreId)
      return (
        <span key={genreId} className={styles.genreTag}>
          {genreMatch ? genreMatch.title : `Unknown (${genreId})`}
        </span>
      )
    })
  }, [show, allGenres])

  /**
   * Calculates total number of episodes across all seasons.
   * @type {number}
   */
  const totalEpisodes = useMemo(() => {
    if (!show || !show.seasons) return 0
    return show.seasons.reduce((acc, season) => acc + season.episodes.length, 0)
  }, [show])

  /**
   * Handles season selection change from dropdown.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The select change event.
   */
  const handleSeasonChange = (e) => {
    setSelectedSeasonIndex(Number(e.target.value))
  }

  if (loading) {
    return (
      <div className={styles.messageContainer}>
        <div className={styles.spinner}></div>
        <p>Loading show details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.messageContainer}>
        <div className={styles.error}>
          Error loading show: {error}
          <Link to="/" className={styles.backLink}>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!show) {
    return (
      <div className={styles.messageContainer}>
        <div className={styles.message}>
          <h3>Show not found.</h3>
          <p>The podcast you are looking for does not exist or has been removed.</p>
          <Link to="/" className={styles.backLink}>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const currentSeason = show.seasons[selectedSeasonIndex]

  return (
    <div className={styles.detailPage}>
      <Link to="/" className={styles.backButton}>
        ← Back to Home
      </Link>

      <div className={styles.showHeader}>
        <img src={show.image || "/placeholder.svg"} alt={show.title} className={styles.showImage} />
        <div className={styles.showInfo}>
          <h1 className={styles.showTitle}>{show.title}</h1>
          <p className={styles.showDescription}>{show.description}</p>
          <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>GENRES</span>
              <div className={styles.genreTagsContainer}>{genreTags}</div>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>LAST UPDATED</span>
              <span className={styles.metaValue}>{formatDate(show.updated)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>TOTAL SEASONS</span>
              <span className={styles.metaValue}>{show.seasons.length} Seasons</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>TOTAL EPISODES</span>
              <span className={styles.metaValue}>{totalEpisodes} Episodes</span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.seasonNavigation}>
        <h2 className={styles.currentSeasonHeading}>Current Season</h2>
        <select
          className={styles.seasonSelect}
          value={selectedSeasonIndex}
          onChange={handleSeasonChange}
          aria-label="Select Season"
        >
          {show.seasons.map((season, index) => (
            <option key={season.season} value={index}>
              Season {season.season}
            </option>
          ))}
        </select>
      </section>

      {currentSeason && (
        <section className={styles.episodeListSection}>
          <h3 className={styles.seasonTitle}>
            Season {currentSeason.season}: {currentSeason.title}
            <span className={styles.episodeCount}> ({currentSeason.episodes.length} Episodes)</span>
          </h3>
          <div className={styles.episodesGrid}>
            {currentSeason.episodes.map((episode, index) => (
              <div key={index} className={styles.episodeCard}>
                <img
                  src={currentSeason.image || "/placeholder.svg"}
                  alt={`Season ${currentSeason.season} cover`}
                  className={styles.episodeImage}
                />
                <div className={styles.episodeInfo}>
                  <p className={styles.episodeNumber}>Episode {index + 1}</p>
                  <h4 className={styles.episodeTitle}>{episode.title}</h4>
                  <p className={styles.episodeDescription}>{episode.description.substring(0, 150)}...</p>{" "}
                  {/* Shortened description */}
                  {/* You might add an audio player here for the episode.file */}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
