import React from "react";

// ======================
// Tipos y constantes
// ======================
export type PaymentMethod = {
  id: string;
  name: string;
  cuotas: number;
  recargo: number; // Ej: 0.1 = 10%
};

export const DEFAULT_METHODS: PaymentMethod[] = [
  { id: "efectivo", name: "Efectivo", cuotas: 1, recargo: 0 },
  { id: "transfer", name: "Transferencia", cuotas: 1, recargo: 0 },
  { id: "debito", name: "Tarjeta de débito", cuotas: 1, recargo: 0 },
  { id: "tc_3", name: "Tarjeta 3 cuotas", cuotas: 3, recargo: 0.1 },
  { id: "tc_6", name: "Tarjeta 6 cuotas", cuotas: 6, recargo: 0.2 },
];

// ======================
// Props del componente
// ======================
type PaymentMethodsListProps = {
  price: number;
  methods?: PaymentMethod[];
};

// ======================
// Componente principal
// ======================
const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  price,
  methods = DEFAULT_METHODS,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-blue-100">
          <tr className="text-center">
            <th className="px-3 py-2 border">Forma de pago</th>
            <th className="px-3 py-2 border">Cuotas</th>
            <th className="px-3 py-2 border">Monto cuota</th>
            <th className="px-3 py-2 border">Total</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {methods.map((method) => {
            const total = price * (1 + method.recargo);
            const cuota = total / method.cuotas;

            return (
              <tr key={method.id} className="hover:bg-blue-50">
                <td className="px-3 py-2 border">{method.name}</td>
                <td className="px-3 py-2 border">{method.cuotas}</td>
                <td className="px-3 py-2 border">
                  ${cuota.toFixed(2)}
                </td>
                <td className="px-3 py-2 border">
                  ${total.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};


export default PaymentMethodsList;
