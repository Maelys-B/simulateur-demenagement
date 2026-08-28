import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import './Register.css';

export default function Register({ onInscription, onAllerVersConnexion }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');

    if (motDePasse !== confirmationMotDePasse) {
      setErreur('Le mot de passe doit être identique');
      return;
    }

    try {
      const reponse = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, mot_de_passe: motDePasse, nom}),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        setErreur(data.erreur);
        return;
      }

      localStorage.setItem('token', data.token);
      onInscription();
    } catch (err) {
      setErreur('Erreur de connexion au serveur');
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Inscription</h2>



      <div className="register-field">
        <label htmlFor="nom">Nom</label>
        <input
          id="nom"
          type="text"
          className="input"
          value={nom}
          onChange={(e)=> setNom(e.target.value)}
        />
      </div>

      <div className="register-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="input"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="motDePasse">Mot de passe</label>
        <div className="register-mdp-wrapper">
          <input
            id="motDePasse"
            type={afficherMotDePasse ? 'text' : 'password'}
            className="input"
            value={motDePasse}
            onChange={(e)=> setMotDePasse(e.target.value)}
            required
          />
          <button
            type="button"
            className="register-mdp-toggle"
            onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
            aria-label={afficherMotDePasse ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {afficherMotDePasse ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="register-field">
        <label htmlFor="confirmationMotDePasse">Confirmer le mot de passe</label>
        <div className="register-mdp-wrapper">
          <input
            id="confirmationMotDePasse"
            type={afficherMotDePasse ? 'text' : 'password'}
            className="input"
            value={confirmationMotDePasse}
            onChange={(e) => setConfirmationMotDePasse(e.target.value)}
            required
          />
          <button
            type="button"
            className="register-mdp-toggle"
            onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
            aria-label={afficherMotDePasse ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {afficherMotDePasse ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      
      {erreur && <p className="register-erreur">{erreur}</p>}
      
      <button type="submit" className="btn btn-primary">S'inscrire</button>

      <button type="button" className="register-lien" onClick={onAllerVersConnexion}>
        Déjà un compte ? Se connecter
      </button>
    </form>
  );
}
