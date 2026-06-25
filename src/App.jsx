import { useState } from 'react'

function App() {
  const [progression, setProgression] = useState(0)

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* Le header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>

        {/* Partie gauche */}
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>
            🏠 Mon déménagement
          </h1>
          <p style={{ color: 'gray', marginTop: '6px' }}>
            Progression : {progression}%
          </p>
          {/* Barre de progression */}
          <div style={{ width: '400px', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '99px', marginTop: '8px' }}>
            <div style={{
              width: `${progression}%`,
              height: '100%',
              backgroundColor: '#2563eb',
              borderRadius: '99px'
            }} />
          </div>
        </div>

        {/* Partie droite : boutons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '10px 18px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            📥 Exporter en PDF
          </button>
          <button style={{ padding: '10px 18px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            🔄 Réinitialiser
          </button>
        </div>

      </div>
    </div>
  )
}

export default App