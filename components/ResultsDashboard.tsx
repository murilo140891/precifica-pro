
import React from 'react';
import { CalculationResults, PricingInputs } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
// Added BarChart3 to the imports from lucide-react
import { TrendingUp, AlertCircle, CheckCircle2, DollarSign, BarChart3 } from 'lucide-react';

interface ResultsDashboardProps {
  inputs: PricingInputs;
  results: CalculationResults;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ inputs, results }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const chartData = [
    { name: 'Custo Mercadoria', value: results.merchandiseCost, color: '#3b82f6' },
    { name: 'Custo Operacional', value: results.finalPrice * (results.variableCostPercent / 100), color: '#f59e0b' },
    { name: 'Custo Fixo', value: results.finalPrice * (results.fixedCostPercent / 100), color: '#8b5cf6' },
    { name: 'Investimento', value: results.finalPrice * (inputs.investmentMargin / 100), color: '#10b981' },
    { name: 'Lucro Líquido', value: results.profitAmount, color: '#ec4899' },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Custo Base', valor: results.merchandiseCost },
    { name: 'Ponto Equilíbrio', valor: results.breakEvenPrice },
    { name: 'Preço Sugerido', valor: results.finalPrice },
  ];

  const isInvalid = results.finalPrice <= 0 || results.totalMarginsPercent >= 100;

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
             <DollarSign size={80} />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Preço de Venda Sugerido</span>
          <span className={`text-4xl font-extrabold tracking-tight ${isInvalid ? 'text-red-500' : 'text-slate-900'}`}>
            {isInvalid ? '---' : formatCurrency(results.finalPrice)}
          </span>
          {!isInvalid && (
             <div className="mt-3 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
               <CheckCircle2 size={12} /> Ótima Margem
             </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Markup Aplicado</span>
          <span className="text-3xl font-bold text-slate-700">
            {isInvalid ? '---' : results.markup.toFixed(3)}
          </span>
          <p className="text-[10px] text-slate-400 mt-2 px-4 uppercase font-medium">Fator multiplicador sobre o custo</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Lucro por Venda</span>
          <span className="text-3xl font-bold text-emerald-600">
            {isInvalid ? '---' : formatCurrency(results.profitAmount)}
          </span>
          <div className="mt-2 text-[10px] text-slate-500 font-semibold bg-slate-50 px-2 py-1 rounded">
            {inputs.profitMargin}% DO PREÇO FINAL
          </div>
        </div>
      </div>

      {isInvalid && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-4 items-center">
          <AlertCircle className="text-red-500" size={32} />
          <div>
            <h4 className="font-bold text-red-900">Atenção: Margens Inválidas</h4>
            <p className="text-sm text-red-700">A soma das suas porcentagens (impostos, lucro, despesas, etc) atingiu ou ultrapassou 100%. Nesse cenário, não há preço que gere lucro. Revise suas margens.</p>
          </div>
        </div>
      )}

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composition Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-500" />
            Composição do Preço Final
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500" />
            Análise de Viabilidade
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis hide />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   formatter={(value: number) => formatCurrency(value)}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? '#3b82f6' : index === 1 ? '#f59e0b' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Ponto de Equilíbrio:</span>
              <span className="font-bold text-amber-600">{formatCurrency(results.breakEvenPrice)}</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">Este é o valor mínimo para não ter prejuízo.</p>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Item da Precificação</th>
              <th className="px-6 py-4">% ou Fator</th>
              <th className="px-6 py-4 text-right">Impacto Financeiro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-4 font-medium text-slate-700">Custo da Mercadoria</td>
              <td className="px-6 py-4 text-slate-500">Base</td>
              <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatCurrency(results.merchandiseCost)}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-slate-700">Custo Variável (Impostos + Gateway)</td>
              <td className="px-6 py-4 text-slate-500">{results.variableCostPercent.toFixed(1)}%</td>
              <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatCurrency(results.finalPrice * results.variableCostPercent / 100)}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-slate-700">Participação de Custos Fixos</td>
              <td className="px-6 py-4 text-slate-500">{results.fixedCostPercent.toFixed(1)}%</td>
              <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatCurrency(results.finalPrice * results.fixedCostPercent / 100)}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-slate-700">Reserva p/ Investimento</td>
              <td className="px-6 py-4 text-slate-500">{inputs.investmentMargin.toFixed(1)}%</td>
              <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatCurrency(results.finalPrice * inputs.investmentMargin / 100)}</td>
            </tr>
            <tr className="bg-emerald-50/50">
              <td className="px-6 py-4 font-bold text-emerald-700">Lucro Líquido Esperado</td>
              <td className="px-6 py-4 text-emerald-600 font-bold">{inputs.profitMargin.toFixed(1)}%</td>
              <td className="px-6 py-4 text-right font-bold text-emerald-700">{formatCurrency(results.profitAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsDashboard;
