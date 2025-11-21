import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ReviewsTogglePage from './pages/ReviewsTogglePage'
import RecommendationsPage from './pages/RecommendationsPage'
import FavoritesPage from './pages/FavoritesPage'
import RatingsPage from './pages/RatingsPage'
import HistoryPage from './pages/HistoryPage'
import InsightsPage from './pages/InsightsPage'
import TagsPage from './pages/TagsPage'

function App() {
  return (
    <div>
      <header>
        <h1>PlotShield Feature Explorer</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/reviews-toggle">Reviews Toggle</Link></li>
            <li><Link to="/recommendations">Recommendations</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/ratings">Ratings</Link></li>
            <li><Link to="/history">History</Link></li>
            <li><Link to="/insights">Insights</Link></li>
            <li><Link to="/tags">Tags</Link></li>
          </ul>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/reviews-toggle" element={<ReviewsTogglePage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/ratings" element={<RatingsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/tags" element={<TagsPage />} />
      </Routes>
    </div>
  )
}

export default App
