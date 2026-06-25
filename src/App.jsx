import { useState } from 'react'

function App() {
  const [progression, setProgression] = useState(0)

  return (
    <div className="app-wrapper">

      <div className="header-card">

        <div>
          <h1 className="header-title">
            🏠 Mon déménagement
          </h1>
          <p className="header-progression">
            Progression : {progression}%
          </p>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progression}%` }}
            />
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-pdf">
            📥 Exporter en PDF
          </button>
          <button className="btn btn-reset">
            🔄 Réinitialiser
          </button>
        </div>

      </div>
    </div>
  )
}

export default App
