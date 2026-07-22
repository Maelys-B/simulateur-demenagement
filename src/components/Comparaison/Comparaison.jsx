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

export default function Comparaison({ budgetSolo, budgetPro }) {
  const donnees = [
    { categorie: 'Budget min', Solo: Math.round(budgetSolo.min), Professionnel: Math.round(budgetPro.min) },
    { categorie: 'Budget max', Solo: Math.round(budgetSolo.max), Professionnel: Math.round(budgetPro.max) },
  ];

  return (
    <div className="card">
      <h2>Comparaison des budgets</h2>
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
    </div>
  );
}
