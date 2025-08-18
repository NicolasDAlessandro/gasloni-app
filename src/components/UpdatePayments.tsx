// UpdatePayments.tsx
import { useState, useEffect } from "react";

interface PaymentMethod {
  method: string;
  interest: number;
  installments: number;
}

const UpdatePayments = () => {
  const [paymentList, setPaymentList] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const storedPayments = JSON.parse(localStorage.getItem("payments") || "[]");
    console.log("Cargando métodos de pago desde localStorage:", storedPayments);
    setPaymentList(storedPayments);
  }, []);

  const handleChange = (
    index: number,
    field: keyof PaymentMethod,
    value: string | number
  ) => {
    const updatedList = [...paymentList];
    updatedList[index] = {
      ...updatedList[index],
      [field]:
        field === "interest" || field === "installments"
          ? Number(value)
          : value,
    };
    setPaymentList(updatedList);
  };

  const handleSave = () => {
    localStorage.setItem("payments", JSON.stringify(paymentList));
    alert("Métodos de pago actualizados");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Actualizar Métodos de Pago
      </h2>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 border-gray-300">
          <thead className="text-xs text-white uppercase bg-blue-800 sticky top-0 shadow text-center">
            <tr>
              <th scope="col" className="px-6 py-3">
                Forma de Pago
              </th>
              <th scope="col" className="px-6 py-3">
                Interés 
              </th>
              <th scope="col" className="px-6 py-3">
                Cuotas
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentList.map((payment, index) => (
              <tr
                key={index}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={payment.method}
                    onChange={(e) =>
                      handleChange(index, "method", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={payment.interest}
                    onChange={(e) =>
                      handleChange(index, "interest", e.target.value)
                    }
                    className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={payment.installments}
                    onChange={(e) =>
                      handleChange(index, "installments", e.target.value)
                    }
                    min={1}
                    className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-700 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-500"
      >
        Guardar Cambios
      </button>
    </div>
  );
};

export default UpdatePayments;
