import React from 'react'
import './Navigation.css'
function Navigation({ongletActif, setOngletActif}) {
    
  return (
    
        <div className="nav-bar">
            
            <button onClick={() => setOngletActif('inventaire')} className={ongletActif === 'inventaire' ? 'nav-btn actif' : 'nav-btn'}> Inventaire
            </button>
            <button onClick={() => setOngletActif('calcul')} className={ongletActif === 'calcul' ? 'nav-btn actif' : 'nav-btn'}> Calcul
            </button>
            <button onClick={() => setOngletActif('comparaison')} className={ongletActif === 'comparaison' ? 'nav-btn actif' : 'nav-btn'}> Comparaison
            </button>
            <button onClick={() => setOngletActif('check-list')} className={ongletActif === 'check-list' ? 'nav-btn actif' : 'nav-btn'}> Check-list
            </button>
            
        </div>
  )
}

export default Navigation