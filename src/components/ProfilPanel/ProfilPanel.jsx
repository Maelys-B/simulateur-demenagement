import { Building, Car, MapPin, User, Users } from 'lucide-react';
import './ProfilPanel.css';

export default function ProfilPanel({ profil, setProfil }) {
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setProfil({ ...profil, [name]: type === 'checkbox' ? checked : value });
  }

  return (
    <form className="profil-panel">
      <h2 className="profil-title icon">
        {' '}
        <User size={20} /> Mon profil
      </h2>

      <div className="profil-field">
        <label htmlFor="type">Type de déménagement</label>
        <select id="type" name="type" value={profil.type} onChange={handleChange}>
          <option value="solo">Solo (je fais moi-même)</option>
          <option value="plusieurs">Je me fais aider</option>
          <option value="pro">Professionnel</option>
        </select>
      </div>

      {profil.type === 'plusieurs' && (
        <div className="profil-field">
          <label htmlFor="nbPersonnes" className="icon">
            <Users size={20} />
            Personnes aidantes
          </label>
          <input
            id="nbPersonnes"
            name="nbPersonnes"
            type="number"
            min="1"
            max="10"
            value={profil.nbPersonnes}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="profil-field">
        <label htmlFor="distance" className="icon">
          {' '}
          <MapPin size={20} />
          Distance (km)
        </label>
        <input
          id="distance"
          name="distance"
          type="number"
          min="0"
          value={profil.distance}
          onChange={handleChange}
          placeholder="ex : 50"
        />
      </div>

      <div className="profil-field">
        <label htmlFor="etage" className="icon">
          <Building size={20} />
          Étage de départ
        </label>
        <input
          id="etage"
          name="etage"
          type="number"
          min="0"
          value={profil.etage}
          onChange={handleChange}
          placeholder="ex : 3"
        />
      </div>

      <div className="profil-field profil-field--checkbox ">
        <input
          id="ascenseur"
          name="ascenseur"
          type="checkbox"
          checked={profil.ascenseur}
          onChange={handleChange}
        />
        <label htmlFor="ascenseur" className="icon">
          <Building size={20} />
          Ascenseur disponible
        </label>
      </div>

      <div className="profil-field profil-field--checkbox">
        <input
          id="parking"
          name="parking"
          type="checkbox"
          checked={profil.parking}
          onChange={handleChange}
        />
        <label htmlFor="parking" className="icon">
          <Car size={20} />
          Parking accessible
        </label>
      </div>
    </form>
  );
}
