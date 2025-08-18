import React from "react";
import * as XLSX from "xlsx";
import type { Product } from "../types/Product";
import { saveProducts } from "../utils/localStorage";

const ProductUploader: React.FC = () => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { raw: false });

        const products: Product[] = jsonData
          .map((row) => {
            const normalizedRow = Object.fromEntries(
              Object.entries(row).map(([k, v]) => [k.trim().toLowerCase(), v])
            );

            const codigo = normalizedRow["codigo"] ?? normalizedRow["código"];
            const detalle = normalizedRow["detalle"];
            const stock = normalizedRow["stock"];
            const precio = normalizedRow["precio"];

            if (!codigo || !detalle || stock === undefined || precio === undefined) {
              return null; // fila inválida
            }

            return {
              codigo: Number(codigo),
              detalle: String(detalle),
              stock: Number(stock),
              precio: Number(precio),
            };
          })
          .filter((p): p is Product => p !== null);

        if (products.length === 0) {
          alert("No se encontraron productos válidos en el archivo.");
          return;
        }
        console.log(products);
        saveProducts(products);
        alert(`Se cargaron ${products.length} productos correctamente.`);
      } catch (error) {
        console.error(error);
        alert("Error al procesar el archivo Excel. Verifica el formato y los datos.");
      }
    };

    reader.onerror = () => {
      alert("Error al leer el archivo.");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4 text-center">Actualizar productos desde Excel</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUploader;
