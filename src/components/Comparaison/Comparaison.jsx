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
import { Scale, TrendingDown, TrendingUp } from 'lucide-react';

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

  return (
    <div className="card">
      <h2 className="comp-titre">Comparaison des budgets</h2>
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
      <div className="comp-economie">
        <p className="comp-economie-titre icon">
          <encart.Icone size={16} /> {encart.titre}
        </p>
        <p className="comp-economie-detail">{encart.texte}</p>
      </div>
    </div>
  );
}
