import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, Truck, PackageCheck } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface OrderTrackerProps {
  orderId: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ orderId }) => {
  const [status, setStatus] = useState<string>('CONFIRMED');
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const eventSource = new EventSource(`/api/orders/${orderId}/sse`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStatus(data.status);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (e) {
        console.error('Failed to parse SSE event', e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [orderId]);

  const steps = [
    { key: 'CONFIRMED', label: 'Pedido Confirmado', icon: CheckCircle2 },
    { key: 'PROCESSING', label: 'Em Separação', icon: Clock },
    { key: 'OUT_FOR_DELIVERY', label: 'Saiu para Entrega', icon: Truck },
    { key: 'DELIVERED', label: 'Entregue', icon: PackageCheck },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === status);

  return (
    <Card elevated className="w-full max-w-xl mx-auto my-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-border">
        <div>
          <span className="text-xs text-slate uppercase tracking-wider block">Acompanhamento ao Vivo</span>
          <h3 className="text-base font-bold text-navy price-tag">Pedido #{orderId.substring(0, 8)}</h3>
        </div>
        <Badge variant="success">SSE Conectado</Badge>
      </div>

      <div className="space-y-4 my-6">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isDone ? 'bg-sage text-white' : 'bg-slate-border/40 text-slate'
                } ${isCurrent ? 'ring-4 ring-sage/20' : ''}`}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${isDone ? 'text-navy' : 'text-slate'}`}>{step.label}</p>
                {isCurrent && (
                  <span className="text-[11px] text-sage font-medium">Status Atual - Atualizado às {lastUpdate}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
