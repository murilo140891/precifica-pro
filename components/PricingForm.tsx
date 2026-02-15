
import React from 'react';
import { Package, Truck, Percent, Briefcase, ShoppingBag, TrendingUp, CreditCard, DollarSign } from 'lucide-react';
import { PricingInputs } from '../types';

interface PricingFormProps {
  inputs: PricingInputs;
  onChange: (field: keyof PricingInputs, value: number) => void;
}

const InputField: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  onChange: (val: number) => void;
  helper?: string;
}> = ({ label, icon, value, suffix, prefix, onChange, helper }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
      {icon}
      {label}
    </label>
    <div className="relative group">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{prefix}</span>
      )}
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder="0.00"
        className={`w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700 ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-9' : ''}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{suffix}</span>
      )}
    </div>
    {helper && <p className="mt-1 text-[10px] text-slate-400 italic">{helper}</p>}
  </div>
);

const PricingForm: React.FC<PricingFormProps> = ({ inputs, onChange }) => {
  return (
    <div className="space-y-8">
      {/* Custo Mercadoria */}
      <div>
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
          <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
          Custos de Aquisição
        </h3>
        <InputField
          label="Custo do Produto"
          icon={<ShoppingBag size={14} />}
          value={inputs.productCost}
          prefix="R$"
          onChange={(v) => onChange('productCost', v)}
        />
        <InputField
          label="Embalagem"
          icon={<Package size={14} />}
          value={inputs.packagingCost}
          prefix="R$"
          onChange={(v) => onChange('packagingCost', v)}
        />
        <InputField
          label="Entrega / Frete"
          icon={<Truck size={14} />}
          value={inputs.deliveryCost}
          prefix="R$"
          onChange={(v) => onChange('deliveryCost', v)}
        />
        <InputField
          label="Índice de Perdas"
          icon={<Percent size={14} />}
          value={inputs.lossRate}
          suffix="%"
          onChange={(v) => onChange('lossRate', v)}
          helper="Estimativa de produtos danificados ou devolvidos"
        />
      </div>

      {/* Custos Variáveis */}
      <div>
        <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
          <div className="w-1 h-3 bg-amber-600 rounded-full"></div>
          Custos Operacionais
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Impostos"
            icon={<Briefcase size={14} />}
            value={inputs.taxes}
            suffix="%"
            onChange={(v) => onChange('taxes', v)}
          />
          <InputField
            label="Gateway"
            icon={<CreditCard size={14} />}
            value={inputs.gatewayFee}
            suffix="%"
            onChange={(v) => onChange('gatewayFee', v)}
          />
        </div>
      </div>

      {/* Custo Fixo */}
      <div>
        <h3 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-4 flex items-center gap-2">
          <div className="w-1 h-3 bg-purple-600 rounded-full"></div>
          Estrutura Fixa
        </h3>
        <InputField
          label="Despesas Fixas Totais"
          icon={<DollarSign size={14} />}
          value={inputs.fixedExpenses}
          prefix="R$"
          onChange={(v) => onChange('fixedExpenses', v)}
          helper="Aluguel, salários, softwares, etc."
        />
        <InputField
          label="Faturamento Médio"
          icon={<TrendingUp size={14} />}
          value={inputs.averageRevenue}
          prefix="R$"
          onChange={(v) => onChange('averageRevenue', v)}
          helper="Soma total das vendas mensais da loja"
        />
      </div>

      {/* Margens */}
      <div>
        <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
          <div className="w-1 h-3 bg-emerald-600 rounded-full"></div>
          Desejado
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Investimento"
            icon={<TrendingUp size={14} />}
            value={inputs.investmentMargin}
            suffix="%"
            onChange={(v) => onChange('investmentMargin', v)}
          />
          <InputField
            label="Margem de Lucro"
            icon={<DollarSign size={14} />}
            value={inputs.profitMargin}
            suffix="%"
            onChange={(v) => onChange('profitMargin', v)}
          />
        </div>
      </div>
    </div>
  );
};

export default PricingForm;
