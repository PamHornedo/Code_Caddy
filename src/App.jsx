import { useState } from 'react'
import Navigation from './components/Navigation'
import BookSearch from './components/BookSearch'
import BookCollection from './components/BookCollection'
import BookDetails from './components/BookDetails'
import './App.css'

function App() {
  // Simple state management for current view
  const [currentView, setCurrentView] = useState('home')
  const [selectedBook, setSelectedBook] = useState(null)

  // TODO: Replace this simple navigation with React Router
  // Students will need to:
  // 1. Install react-router-dom: npm install react-router-dom
  // 2. Import BrowserRouter, Routes, Route, Link from react-router-dom
  // 3. Replace the conditional rendering below with proper routing
  // 4. Create separate page components for each route
  // 5. Update Navigation component to use Link components instead of buttons

  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return <BookSearch onBookSelect={setSelectedBook} />
      case 'collection':
        return <BookCollection onBookSelect={setSelectedBook} />
      case 'book-details':
        return selectedBook ? (
          <BookDetails book={selectedBook} onBack={() => setCurrentView('collection')} />
        ) : (
          <div>No book selected</div>
        )
      default:
        return (
          <div className="home-view">
            <h1>Welcome to CodeCaddy</h1>
            <p>Your personal book collection manager</p>
            <div className="quick-actions">
              <button onClick={() => setCurrentView('search')} className="btn-primary">
                Search Books
              </button>
              <button onClick={() => setCurrentView('collection')} className="btn-secondary">
                View Collection
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="app">
      <Navigation 
        currentView={currentView} 
        onNavigate={setCurrentView}
      />
      
      <main className="main-content">
        {renderCurrentView()}
      </main>

      {/* 
      TODO: Replace the above conditional rendering with React Router setup:
      
      <BrowserRouter>
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/book/:id" element={<BookDetailsPage />} />
          </Routes>
        </main>
      </BrowserRouter>
      */}
    </div>
  )
}

export default App