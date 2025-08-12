import React, { useMemo, useState } from "react";
import type { PaymentMethod } from "./PaymentOptions";
import { useCart } from "../context/CartContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AVAILABLE_METHODS: PaymentMethod[] = [
  { id: "efectivo", name: "Efectivo", cuotas: 1, recargo: 0 },
  { id: "transfer", name: "Transferencia", cuotas: 1, recargo: 0 },
  { id: "debito", name: "Tarjeta débito", cuotas: 1, recargo: 0 },
  { id: "tc_3", name: "Tarjeta 3 cuotas", cuotas: 3, recargo: 0.1 },
  { id: "tc_6", name: "Tarjeta 6 cuotas", cuotas: 6, recargo: 0.2 },
];

const CartModal: React.FC<Props> = ({ open, onClose }) => {
  // useCart expone 'items', 'subtotal', 'remove', 'setQty', 'clear'
  const { items, remove, setQty, clear, subtotal } = useCart();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggleMethod = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const selectedMethods = useMemo(
    () => AVAILABLE_METHODS.filter((m) => selected[m.id]),
    [selected]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Presupuesto</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => clear()} className="px-3 py-1 text-sm bg-red-100 rounded">
              Vaciar
            </button>
            <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">
              Cerrar
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Lista de productos */}
          <div className="max-h-60 overflow-y-auto border rounded p-2">
            {items.length === 0 ? (
              <div className="text-sm text-gray-500">No hay productos en el presupuesto.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-600 text-center">
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={String(it.product.codigo)} className="border-t text-center">
                      <td className="py-2">{it.product.detalle}</td>
                      <td className="py-2">${it.product.precio.toFixed(2)}</td>
                      <td className="py-2">
                        <input
                          type="number"
                          min={0}
                          value={it.qty}
                          onChange={(e) => setQty(it.product.codigo, Number(e.target.value))}
                          className="w-16 border rounded px-2 py-1 text-center"
                        />
                      </td>
                      <td className="py-2">${(it.product.precio * it.qty).toFixed(2)}</td>
                      <td className="py-2">
                        <button onClick={() => remove(it.product.codigo)} className="text-sm text-red-600">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Selección de métodos y resumen */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 border rounded">
              <div className="font-semibold mb-2">Seleccionar formas de pago</div>
              <div className="flex flex-col gap-2">
                {AVAILABLE_METHODS.map((m) => (
                  <label key={m.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={!!selected[m.id]} onChange={() => toggleMethod(m.id)} />
                    <span>{m.name} {m.cuotas > 1 ? `(${m.cuotas} cuotas)` : ""}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-2 border rounded">
              <div className="font-semibold mb-2">Resumen</div>
              <div className="text-sm">Subtotal: <strong>${subtotal.toFixed(2)}</strong></div>
              <div className="text-sm mt-2">Opciones seleccionadas: {selectedMethods.length || 0}</div>
            </div>
          </div>

          {/* Tablas por método seleccionado */}
          <div>
            {selectedMethods.length === 0 ? (
              <div className="text-sm text-gray-500">No hay formas de pago seleccionadas.</div>
            ) : (
              selectedMethods.map((m) => (
                <div key={m.id} className="mb-4">
                  <div className="font-medium mb-2">{m.name}</div>
                  <div className="bg-white border rounded p-2">
                    <table className="w-full text-sm text-center">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1">Cuotas</th>
                          <th className="px-2 py-1">Monto cuota</th>
                          <th className="px-2 py-1">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-2 py-1">{m.cuotas}</td>
                          <td className="px-2 py-1">${((subtotal * (1 + m.recargo)) / m.cuotas).toFixed(2)}</td>
                          <td className="px-2 py-1">${(subtotal * (1 + m.recargo)).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t flex justify-end gap-2">
          <button onClick={() => alert("Presupuesto guardado (simulado)")} className="px-4 py-2 bg-green-600 text-white rounded">
            Generar presupuesto
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
