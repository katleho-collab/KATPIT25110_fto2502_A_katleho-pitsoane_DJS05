"use client"

import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom" // Import Routes and Route
import { PodcastProvider } from "./context/PodcastContext"
import { fetchPodcasts } from "./api/fetchPodcasts"
import { genres } from "./data"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import SortSelect from "./components/SortSelect"
import GenreFilter from "./components/GenreFilter"
import PodcastGrid from "./components/PodcastGrid"
import Pagination from "./components/Pagination"
import ShowDetailPage from "./components/ShowDetailPage" // Import the new ShowDetailPage
import styles from "./App.module.css"

/**
 * Root component of the Podcast Explorer app.
 * Handles data fetching and layout composition.
 */
export default function App() {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPodcasts(setPodcasts, setError, setLoading)
  }, [])

  return (
    <>
      <Header />
      <Routes>
        {" "}
        {/* Use Routes to define your application routes */}
        <Route
          path="/"
          element={
            <PodcastProvider initialPodcasts={podcasts}>
              <main className={styles.main}>
                <section className={styles.controls}>
                  <SearchBar />
                  <GenreFilter genres={genres} />
                  <SortSelect />
                </section>
                {loading && (
                  <div className={styles.messageContainer}>
                    <div className={styles.spinner}></div>
                    <p>Loading podcasts...</p>
                  </div>
                )}
                {error && (
                  <div className={styles.message}>
                    <div className={styles.error}>Error occurred while fetching podcasts: {error}</div>
                  </div>
                )}
                {!loading && !error && (
                  <>
                    <PodcastGrid genres={genres} />
                    <Pagination />
                  </>
                )}
              </main>
            </PodcastProvider>
          }
        />
        {/* New route for the Show Detail Page */}
        <Route path="/podcast/:id" element={<ShowDetailPage genres={genres} />} />
      </Routes>
    </>
  )
}
