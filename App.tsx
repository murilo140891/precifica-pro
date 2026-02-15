
import React, { useState, useMemo } from 'react';
import { Calculator as CalcIcon, Info, TrendingUp, DollarSign, BarChart3, Sparkles, Loader2, X } from 'lucide-react';
import PricingForm from './components/PricingForm';
import ResultsDashboard from './components/ResultsDashboard';
import { PricingInputs, CalculationResults } from './types';
import { GoogleGenAI } from "@google/genai";

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
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    const totalMarginsPercent = (variableCostPercent + fixedCostPercent + investmentMargin + profitMargin) / 100;
    
    // Markup Divisor padrão de mercado.
    const markup = totalMarginsPercent < 1 ? 1 / (1 - totalMarginsPercent) : 0;

    // 5. Custo Final do Produto = Custo da Mercadoria * Markup
    const finalPrice = merchandiseCost * markup;

    // Lucro Real em R$
    const profitAmount = finalPrice * (profitMargin / 100);

    // Ponto de Equilíbrio
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

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Aja como um consultor financeiro sênior especializado em precificação para pequenos negócios brasileiros.
        Analise os seguintes dados de um produto para me dar um conselho estratégico:
        
        DADOS DE ENTRADA:
        - Custo do Produto: R$ ${inputs.productCost}
        - Embalagem: R$ ${inputs.packagingCost}
        - Frete: R$ ${inputs.deliveryCost}
        - Taxa de Perda: ${inputs.lossRate}%
        - Impostos: ${inputs.taxes}%
        - Taxa de Gateway: ${inputs.gatewayFee}%
        - Despesas Fixas do Negócio: R$ ${inputs.fixedExpenses}
        - Faturamento Médio Mensal: R$ ${inputs.averageRevenue}
        - Margem de Lucro Desejada: ${inputs.profitMargin}%
        
        RESULTADOS CALCULADOS:
        - Preço Sugerido: R$ ${results.finalPrice.toFixed(2)}
        - Markup Divisor: ${results.markup.toFixed(2)}
        - Lucro Real por Venda: R$ ${results.profitAmount.toFixed(2)}
        - Ponto de Equilíbrio (Custo Zero): R$ ${results.breakEvenPrice.toFixed(2)}
        
        Por favor, forneça uma análise curta e objetiva em português (máximo 3 parágrafos) sobre:
        1. A saúde dessa precificação (é sustentável?).
        2. Riscos potenciais (ex: se o markup está muito baixo ou se o custo fixo está "comendo" a margem).
        3. Uma sugestão prática para melhorar a rentabilidade.
        Use um tom profissional e direto ao ponto.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiAnalysis(response.text || "Não foi possível gerar a análise estratégica no momento.");
    } catch (error) {
      console.error("AI Analysis Error:", error);
      setAiAnalysis("Erro ao conectar com o assistente financeiro. Verifique seus parâmetros e tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-100">
              <CalcIcon size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Precifica<span className="text-blue-600">Pro</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <button 
              onClick={analyzeWithAI}
              disabled={isAnalyzing || results.finalPrice <= 0}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-all bg-blue-50 px-4 py-2 rounded-full border border-blue-100 hover:bg-blue-100"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              Consultoria IA
            </button>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95">
              Exportar Dados
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* AI Insight Notification */}
        {aiAnalysis && (
          <div className="mb-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-1 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white rounded-[1.4rem] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setAiAnalysis(null)} className="text-slate-300 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-start gap-5">
                <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 shrink-0">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Análise Estratégica</h2>
                  <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap max-w-3xl">
                    {aiAnalysis}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                <strong>Dica:</strong> Uma precificação saudável geralmente mantém o markup acima de 2.0 para cobrir custos operacionais e permitir reinvestimento.
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
