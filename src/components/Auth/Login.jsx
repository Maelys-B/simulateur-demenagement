import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import './Login.css';

export default function Login({ onConnexion, onAllerVersInscription }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');

    try {
      const reponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        setErreur(data.erreur);
        return;
      }

      localStorage.setItem('token', data.token);
      onConnexion();
    } catch (err) {
      setErreur('Erreur de connexion au serveur');
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Connexion</h2>

      {erreur && <p className="login-erreur">{erreur}</p>}

      <div className="login-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="motDePasse">Mot de passe</label>
        <div className="login-mdp-wrapper">
          <input
            id="motDePasse"
            type={afficherMotDePasse ? 'text' : 'password'}
            className="input"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
          <button
            type="button"
            className="login-mdp-toggle"
            onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
            aria-label={afficherMotDePasse ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {afficherMotDePasse ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button type="submit" className="btn btn-primary">Se connecter</button>

      <button type="button" className="login-lien" onClick={onAllerVersInscription}>
        Pas encore de compte ? S'inscrire
      </button>
    </form>
  );
}
