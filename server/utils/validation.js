const REGEX_MOT_DE_PASSE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function motDePasseValide(motDePasse) {
  return REGEX_MOT_DE_PASSE.test(motDePasse);
}

module.exports = { motDePasseValide };
