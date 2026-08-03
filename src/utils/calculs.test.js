import { describe, expect, it } from 'vitest';
import {
  calculerBudgetPro,
  calculerBudgetSolo,
  calculerCartons,
  calculerCartonsGlobal,
  calculerTemps,
  calculerVolume,
  determinerCamion,
  determinerPersonne,
} from './calculs';

describe('calculerVolume', () => {
  it('retourne 2 pour un volume à 2', () => {
    const pieces = [
      { nom: 'Salon', objets: [{ nom: 'Canapé', volume: 2, quantite: 1 }], objetsAEmballer: [] },
    ];
    expect(calculerVolume(pieces)).toBe(2);
  });

  it('retourne 0 pour un inventaire vide', () => {
    expect(calculerVolume([])).toBe(0);
  });
});

describe('determinerCamion', () => {
  it('retourne Camion 30m³ si le volume est entre 20 et 30', () => {
    expect(determinerCamion(30)).toBe('Camion 30m³');
  });
});

describe('determinerPersonne', () => {
  it('retourne 2 à 3 personnes pour un volume entre 10 et 20', () => {
    expect(determinerPersonne(15)).toBe('2 à 3 personnes');
  });
});

describe('calculerTemps', () => {
  it('retourne 4h06 avec les valeurs entrées', () => {
    const temps = calculerTemps(10, 5, 50, 1);
    expect(temps.total).toBe('4h06');
  });
});

describe('calculerCartons', () => {
  it('retourne 3 grands cartons', () => {
    const pieces = [
      {
        nom: 'Salon',
        objets: [],
        objetsAEmballer: [{ nom: 'Tente (sac)', volume: 0.025, quantite: 5, carton: 'grand' }],
      },
    ];
    const resultat = calculerCartons(pieces);
    expect(resultat[0].grand.nb).toBe(3);
  });
});

describe('calculerCartonsGlobal', () => {
  it('retourne 3 grands cartons', () => {
    const pieces = [
      {
        nom: 'Salon',
        objets: [],
        objetsAEmballer: [{ nom: 'Tente (sac)', volume: 0.025, quantite: 4, carton: 'grand' }],
      },
      {
        nom: 'Cuisine',
        objets: [],
        objetsAEmballer: [
          { nom: 'Plaid / Coussins déco (lot)', volume: 0.015, quantite: 3, carton: 'grand' },
          { nom: 'Plante artificielle', volume: 0.01, quantite: 3, carton: 'grand' },
        ],
      },
    ];
    const resultat = calculerCartonsGlobal(pieces);
    expect(resultat.grand.nb).toBe(3);
  });
});

describe('calculerBudgetSolo', () => {
  it('calcule le budget solo pour un volume de 10m³ et 50km', () => {
    const budget = calculerBudgetSolo(10, 50, 20);
    expect(budget.min).toBe(142.5);
    expect(budget.max).toBe(242.5);
  });

  it('gère une distance négative sans planter', () => {
    const budget = calculerBudgetSolo(10, -50, 0);
    expect(budget.min).toBe(67.5);
  });
});

describe('calculerBudgetPro', () => {
  it('calcule le budget pro en formule standard pour 10m³ et 50km', () => {
    const budget = calculerBudgetPro(10, 50, 2, true, 'standard', true);
    expect(budget.min).toBe(625);
    expect(budget.max).toBe(1125);
  });

  it("applique la majoration si le parking n'est pas accessible", () => {
    const avecParking = calculerBudgetPro(10, 50, 2, true, 'standard', true);
    const sansParking = calculerBudgetPro(10, 50, 2, true, 'standard', false);
    expect(sansParking.min).toBeGreaterThan(avecParking.min);
  });

  it('gère un volume négatif sans planter', () => {
    const budget = calculerBudgetPro(-10, 50, 2, true, 'economique', true);
    expect(budget.min).toBe(-225);
  });
});
