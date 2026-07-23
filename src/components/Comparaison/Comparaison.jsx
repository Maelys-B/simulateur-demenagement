import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './Comparaison.css';
import { Check, Scale, TrendingDown, TrendingUp, X } from 'lucide-react';

export default function Comparaison({ budgetSolo, budgetPro }) {
  const economie = Math.round(budgetPro.min - budgetSolo.min);

  let encart;
  if (economie > 0) {
    encart = {
      Icone: TrendingUp,
      titre: `Économie potentielle : ${economie} €`,
      texte: `En choisissant un déménagement solo, vous pourriez économiser jusqu'à ${economie}€, mais cela nécessitera plus de temps et d'efforts de votre part.`,
    };
  } else if (economie < 0) {
    const surcout = Math.abs(economie);
    encart = {
      Icone: TrendingDown,
      titre: `Surcoût professionnel : ${surcout} €`,
      texte: `Le service professionnel vous coûtera ${surcout}€ de plus, mais vous bénéficierez d'une prestation complète et sécurisée.`,
    };
  } else {
    encart = {
      Icone: Scale,
      titre: 'Budgets équivalents',
      texte: "Les deux options ont un coût similaire. Le choix dépend alors de votre temps disponible et de votre préférence pour le confort ou l'autonomie.",
    };
  }

  const donnees = [
    { categorie: 'Budget min', Solo: Math.round(budgetSolo.min), Professionnel: Math.round(budgetPro.min) },
    { categorie: 'Budget max', Solo: Math.round(budgetSolo.max), Professionnel: Math.round(budgetPro.max) },
  ];

  const tableaux = [
    {
      titre: 'Déménagement solo',
      couleur: 'blue',
      avantages: ['Coût moins élevé', 'Flexibilité des horaires', 'Contrôle total du déménagement'],
      inconvenients: ['Effort physique important', 'Risque de casse plus élevé', 'Temps de préparation long', "Besoin d'organiser aide extérieure"],
    },
    {
      titre: 'Déménagement professionnel',
      couleur: 'green',
      avantages: ["Rapidité d'exécution", 'Assurance en cas de casse', 'Équipement professionnel fourni', 'Expérience et efficacité', 'Moins de stress'],
      inconvenients: ['Coût plus élevé', 'Dépendance aux horaires du prestataire', "Besoin de réserver à l'avance"],
    },
  ];

  return (
    <div>
      <div className="card">
        <h2 className="comp-title">Comparaison des budgets</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={donnees}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categorie" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} €`} />
            <Legend />
            <Bar dataKey="Solo" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Professionnel" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="comp-savings">
          <p className="comp-savings-title icon">
            <encart.Icone size={16} /> {encart.titre}
          </p>
          <p className="comp-savings-detail">{encart.texte}</p>
        </div>
      </div>
      <div className="comp-tables">
        {tableaux.map((col) => (
          <div key={col.titre} className="comp-table card">
            <h3 className={`comp-table-title comp-table-title--${col.couleur}`}>{col.titre}</h3>
            <p className="comp-table-section">Avantages</p>
            <ul className="comp-advantages">
              {col.avantages.map((a) => (
                <li key={a} className="comp-item icon"><Check size={14} color="#16a34a" /> {a}</li>
              ))}
            </ul>
            <p className="comp-table-section">Inconvénients</p>
            <ul>
              {col.inconvenients.map((i) => (
                <li key={i} className="comp-item comp-item--disadvantage icon"><X size={14} color="#dc2626" /> {i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
