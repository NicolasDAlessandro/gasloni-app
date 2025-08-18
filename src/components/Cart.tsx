import React, { useMemo, useState } from "react";
import type { PaymentMethod } from "./PaymentOptions";
import { useCart } from "../context/CartContext";

const AVAILABLE_METHODS: PaymentMethod[] = [
  { id: "efectivo", name: "Efectivo", cuotas: 1, recargo: 0 },
  { id: "transfer", name: "Transferencia", cuotas: 1, recargo: 0 },
  { id: "debito", name: "Tarjeta débito", cuotas: 1, recargo: 0 },
  { id: "tc_3", name: "Tarjeta 3 cuotas", cuotas: 3, recargo: 0 },
  { id: "tc_6", name: "Tarjeta 6 cuotas", cuotas: 6, recargo: 0.08 },
];

type ManualPayment = { nombre: string; cuotas: number; monto: number };

const CartPage: React.FC = () => {
  const { items, remove, setQty, subtotal } = useCart();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [manualValues, setManualValues] = useState<ManualPayment>({
    nombre: "",
    cuotas: 0,
    monto: 0,
  });
  const [manualList, setManualList] = useState<ManualPayment[]>([]);

  const toggleMethod = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const selectedMethods = useMemo(
    () => AVAILABLE_METHODS.filter((m) => selected[m.id]),
    [selected]
  );

  const addManual = () => {
    if (
      manualValues.nombre.trim() &&
      manualValues.cuotas > 0 &&
      manualValues.monto > 0
    ) {
      setManualList((prev) => [...prev, manualValues]);
      setManualValues({ nombre: "", cuotas: 0, monto: 0 }); // reset
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Lista de productos */}
      <div className="max-h-60 overflow-y-auto border rounded p-2 mb-4">
        {items.length === 0 ? (
          <div className="text-sm text-gray-500">
            No hay productos en el presupuesto.
          </div>
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
                <tr
                  key={String(it.product.codigo)}
                  className="border-t text-center"
                >
                  <td className="py-2">{it.product.detalle}</td>
                  <td className="py-2">${it.product.precio.toFixed(2)}</td>
                  <td className="py-2">
                    <input
                      type="number"
                      min={0}
                      value={it.qty}
                      onChange={(e) =>
                        setQty(it.product.codigo, Number(e.target.value))
                      }
                      className="w-16 border rounded px-2 py-1 text-center"
                    />
                  </td>
                  <td className="py-2">
                    ${(it.product.precio * it.qty).toFixed(2)}
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => remove(it.product.codigo)}
                      className="text-sm text-red-600"
                    >
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
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-2 border rounded">
          <div className="font-semibold mb-2">Seleccionar formas de pago</div>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {AVAILABLE_METHODS.map((m) => (
              <label key={m.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!selected[m.id]}
                  onChange={() => toggleMethod(m.id)}
                />
                <span>
                  {m.name} {m.cuotas > 1 ? `(${m.cuotas} cuotas)` : ""}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-2 border rounded">
          <div className="font-semibold mb-2">Resumen</div>
          <div className="text-sm">
            Subtotal: <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div className="text-sm mt-2">
            Opciones seleccionadas: {selectedMethods.length + manualList.length}
          </div>
        </div>
      </div>

      {/* Ingreso manual */}
      <div className="p-2 border rounded mb-4">
        <div className="font-medium mb-2">Ingreso manual</div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm">Nombre / referencia</label>
            <input
              type="text"
              value={manualValues.nombre}
              onChange={(e) =>
                setManualValues({ ...manualValues, nombre: e.target.value })
              }
              placeholder="Ej: Promo banco, Plan especial"
              className="border px-2 py-1 rounded w-48"
            />
          </div>
          <div>
            <label className="block text-sm">Cantidad de cuotas</label>
            <input
              type="number"
              value={manualValues.cuotas}
              onChange={(e) =>
                setManualValues({
                  ...manualValues,
                  cuotas: Number(e.target.value),
                })
              }
              className="border px-2 py-1 rounded w-20 text-center"
            />
          </div>
          <div>
            <label className="block text-sm">Monto por cuota</label>
            <input
              type="number"
              value={manualValues.monto}
              onChange={(e) =>
                setManualValues({
                  ...manualValues,
                  monto: Number(e.target.value),
                })
              }
              className="border px-2 py-1 rounded w-28 text-center"
            />
          </div>
          <button
            onClick={addManual}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Tablas por método seleccionado */}
      {selectedMethods.map((m) => (
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
                  <td className="px-2 py-1">
                    ${((subtotal * (1 + m.recargo)) / m.cuotas).toFixed(2)}
                  </td>
                  <td className="px-2 py-1">
                    ${(subtotal * (1 + m.recargo)).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Tablas de ingresos manuales */}
      {manualList.length > 0 && (
        <div className="mb-4">
          <div className="font-medium mb-2">Ingresos manuales</div>
          <div className="bg-white border rounded p-2">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1">Forma de pago</th>
                  <th className="px-2 py-1">Cuotas</th>
                  <th className="px-2 py-1">Monto cuota</th>
                  <th className="px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {manualList.map((m, i) => (
                  <tr key={i}>
                    <td>{m.nombre}</td>
                    <td>{m.cuotas}</td>
                    <td>${m.monto.toFixed(2)}</td>
                    <td>${(m.cuotas * m.monto).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => alert("Presupuesto guardado (simulado)")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Generar presupuesto
        </button>
      </div>
    </div>
  );
};

export default CartPage;
