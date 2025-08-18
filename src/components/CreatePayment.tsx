import { useState } from "react";

interface PaymentMethod {
  method: string;
  interest: number;
  installments: number;
}

const CreatePayment = () => {
  const [payment, setPayment] = useState<PaymentMethod>({
    method: "",
    interest: 0,
    installments: 1,
  });

  const [paymentList, setPaymentList] = useState<PaymentMethod[]>(
    JSON.parse(localStorage.getItem("payments") || "[]")
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPayment({
      ...payment,
      [name]:
        name === "interest" || name === "installments"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!payment.method.trim()) return alert("Ingrese una forma de pago");

    const updatedList = [...paymentList, payment];
    setPaymentList(updatedList);
    localStorage.setItem("payments", JSON.stringify(updatedList));

    // Reiniciamos el formulario
    setPayment({ method: "", interest: 0, installments: 1 });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        {/* Forma de pago */}
        <div className="mb-5">
          <label htmlFor="method" className="block mb-1 text-sm font-medium text-gray-700">
            Forma de pago
          </label>
          <input
            type="text"
            name="method"
            id="method"
            value={payment.method}
            onChange={handleChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Interés */}
        <div className="mb-5">
          <label htmlFor="interest" className="block mb-1 text-sm font-medium text-gray-700">
            Interés (%)
          </label>
          <input
            type="number"
            name="interest"
            id="interest"
            value={payment.interest}
            onChange={handleChange}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cantidad de cuotas */}
        <div className="mb-5">
          <label htmlFor="installments" className="block mb-1 text-sm font-medium text-gray-700">
            Cantidad de cuotas
          </label>
          <input
            type="number"
            name="installments"
            id="installments"
            value={payment.installments}
            onChange={handleChange}
            min={1}
            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
        >
          Guardar
        </button>
      </form>
    </div>

  );
};

export default CreatePayment;
