function Navigation({ currentView, onNavigate }) {
  // TODO: Students will convert this to use React Router Link components
  // Replace button onClick handlers with Link to="/route" components
  
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>CodeCaddy</h2>
      </div>
      
      <div className="nav-links">
        <button 
          className={currentView === 'home' ? 'nav-link active' : 'nav-link'}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        
        <button 
          className={currentView === 'search' ? 'nav-link active' : 'nav-link'}
          onClick={() => onNavigate('search')}
        >
          Search
        </button>
        
        <button 
          className={currentView === 'collection' ? 'nav-link active' : 'nav-link'}
          onClick={() => onNavigate('collection')}
        >
          My Collection
        </button>
      </div>
    </nav>
  )
}

export default Navigation