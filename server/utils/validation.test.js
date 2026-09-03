import { describe, expect, it } from 'vitest';
import { motDePasseValide } from './validation.js';

describe('motDePasseValide', () => {
  it('accepte un mot de passe valide', () => {
    expect(motDePasseValide("Abcdefg1!")).toBe(true);
  });

  it('refuse un mot de passe trop court', () => {
    expect(motDePasseValide("Ab1!")).toBe(false);
  });

  it('refuse un mot de passe sans majuscule', () => {
    expect(motDePasseValide("abcdefg1!")).toBe(false);
  });

  it('refuse un mot de passe sans minuscule', () => {
    expect(motDePasseValide("ABCDEFG1!")).toBe(false);
  });

  it('refuse un mot de passe sans chiffre', () => {
    expect(motDePasseValide("Abcdefg!")).toBe(false);
  });

  it('refuse un mot de passe sans caractère spécial', () => {
    expect(motDePasseValide("Abcdefg1")).toBe(false);
  });

  it('refuse une chaîne vide', () => {
    expect(motDePasseValide('')).toBe(false);
  });
});
