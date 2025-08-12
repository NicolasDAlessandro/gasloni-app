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
    <div className="max-w-md mx-auto mt-6">
      <form onSubmit={handleSubmit}>
        {/* Forma de pago */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="method"
            id="method"
            value={payment.method}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent 
              border-0 border-b-2 border-gray-300 appearance-none dark:text-white 
              dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none 
              focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="method"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 
              duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
              peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Forma de pago
          </label>
        </div>

        {/* Interés */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="number"
            name="interest"
            id="interest"
            value={payment.interest}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent 
              border-0 border-b-2 border-gray-300 appearance-none dark:text-white 
              dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none 
              focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="interest"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 
              duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
              peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Interés (%)
          </label>
        </div>

        {/* Cantidad de cuotas */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="number"
            name="installments"
            id="installments"
            value={payment.installments}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent 
              border-0 border-b-2 border-gray-300 appearance-none dark:text-white 
              dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none 
              focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            min={1}
          />
          <label
            htmlFor="installments"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 
              duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
              peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Cantidad de cuotas
          </label>
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
            focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
            text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 
            dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Guardar
        </button>
      </form>

      {/* Lista de pagos creados */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Formas de pago</h3>
        <ul className="list-disc pl-5">
          {paymentList.map((p, idx) => (
            <li key={idx}>
              {p.method} - {p.interest}% - {p.installments} cuota(s)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreatePayment;
