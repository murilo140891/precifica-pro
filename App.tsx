
import React, { useState, useEffect, useMemo } from 'react';
import { Calculator as CalcIcon, Info, TrendingUp, DollarSign, Package, Truck, Percent, Briefcase, BarChart3 } from 'lucide-react';
import PricingForm from './components/PricingForm';
import ResultsDashboard from './components/ResultsDashboard';
import { PricingInputs, CalculationResults } from './types';

const INITIAL_STATE: PricingInputs = {
  productCost: 0,
  packagingCost: 0,
  deliveryCost: 0,
  lossRate: 0,
  taxes: 0,
  gatewayFee: 0,
  fixedExpenses: 0,
  averageRevenue: 0,
  investmentMargin: 0,
  profitMargin: 0,
};

const App: React.FC = () => {
  const [inputs, setInputs] = useState<PricingInputs>(INITIAL_STATE);

  const results = useMemo((): CalculationResults => {
    const {
      productCost,
      packagingCost,
      deliveryCost,
      lossRate,
      taxes,
      gatewayFee,
      fixedExpenses,
      averageRevenue,
      investmentMargin,
      profitMargin
    } = inputs;

    // 1. Custo da Mercadoria = (Custo Produto + Embalagem + Entrega) / (1 - Índice de Perdas %)
    const lossFactor = 1 - (lossRate / 100);
    const merchandiseCost = (productCost + packagingCost + deliveryCost) / (lossFactor || 1);

    // 2. Custo Variável = Impostos % + Gateway Pagamento %
    const variableCostPercent = taxes + gatewayFee;

    // 3. Custo Fixo = Despesas Fixas / Faturamento Médio
    const fixedCostPercent = averageRevenue > 0 ? (fixedExpenses / averageRevenue) * 100 : 0;

    // 4. Margem Total para Markup Divisor
    // Nota: O Markup tradicional (Divisor) é o método mais seguro para manter margens.
    // Usaremos a lógica do markup divisor para garantir que a margem seja sobre o preço final.
    const totalMarginsPercent = (variableCostPercent + fixedCostPercent + investmentMargin + profitMargin) / 100;
    
    // Markup = 1 / (1 - Margens Totais)
    // Se usarmos a fórmula sugerida (1 / (1 + sum)), o preço cai conforme as despesas aumentam, 
    // o que é um erro comum de precificação. Adotaremos o Markup Divisor padrão de mercado.
    const markup = totalMarginsPercent < 1 ? 1 / (1 - totalMarginsPercent) : 0;

    // 5. Custo Final do Produto = Custo da Mercadoria * Markup
    const finalPrice = merchandiseCost * markup;

    // Lucro Real em R$
    const profitAmount = finalPrice * (profitMargin / 100);

    // Ponto de Equilíbrio (Apenas cobrindo custos, sem lucro e investimento)
    const breakEvenMargins = (variableCostPercent + fixedCostPercent) / 100;
    const breakEvenMarkup = breakEvenMargins < 1 ? 1 / (1 - breakEvenMargins) : 0;
    const breakEvenPrice = merchandiseCost * breakEvenMarkup;

    return {
      merchandiseCost,
      variableCostPercent,
      fixedCostPercent,
      markup,
      finalPrice,
      profitAmount,
      breakEvenPrice,
      totalMarginsPercent: totalMarginsPercent * 100
    };
  }, [inputs]);

  const handleInputChange = (field: keyof PricingInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <CalcIcon size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Precifica<span className="text-blue-600">Pro</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Como funciona?</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Ajuda</a>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm">
              Exportar Relatório
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Column */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-800">Parâmetros do Produto</h2>
              </div>
              <div className="p-6">
                <PricingForm inputs={inputs} onChange={handleInputChange} />
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <Info className="text-blue-600 shrink-0" size={20} />
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>Dica:</strong> A precificação correta considera não apenas o custo direto, mas também as perdas invisíveis e a estrutura fixa do seu negócio.
              </p>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            <ResultsDashboard inputs={inputs} results={results} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
