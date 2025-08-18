// ProductTable.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";
import PaymentOptions from "./PaymentOptions";
import Toast from "./Toast"; 

const ProductTable: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { add } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem("productos");
    if (!stored) return;
    try {
      const parsed: Product[] = JSON.parse(stored);
      parsed.sort((a, b) =>
        a.detalle.localeCompare(b.detalle, "es", { sensitivity: "base" })
      );
      setAllProducts(parsed);
    } catch (err) {
      console.error("Error parseando productos:", err);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return allProducts;
    const q = searchQuery.toUpperCase();
    return allProducts.filter((p) =>
      String(p.detalle ?? "").toUpperCase().includes(q)
    );
  }, [allProducts, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const handleAgregar = (product: Product) => {
    add(product);
    setToastMessage(`Producto "${product.detalle}" agregado al carrito ✅`);
  };

  const toggleExpand = (codigo: string) => {
    setExpandedRow((prev) => (prev === codigo ? null : codigo));
  };

  return (
    <div className="mt-4 relative">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSubmit={handleSubmit}
        handleClear={handleClear}
      />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-500 border-gray-300">
          <thead className="text-xs text-white uppercase bg-blue-800 sticky top-0 shadow text-center">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Detalle</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod, idx) => (
                <React.Fragment key={`${prod.codigo}-${idx}`}>
                  <tr
                    onClick={() => toggleExpand(prod.codigo.toString())}
                    className={`cursor-pointer ${
                      idx % 2 === 0
                        ? "bg-white border-b hover:bg-gray-50"
                        : "bg-gray-50 border-b hover:bg-gray-100"
                    }`}
                  >
                    <td className="px-6 py-4 text-center">{prod.codigo}</td>
                    <td className="px-6 py-4">{prod.detalle}</td>
                    <td className="px-6 py-4 text-center">{prod.stock}</td>
                    <td className="px-6 py-4 text-center">
                      ${prod.precio.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgregar(prod);
                        }}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>

                  {expandedRow === prod.codigo.toString() && (
                    <tr className="bg-blue-50">
                      <td colSpan={5} className="px-6 py-4">
                        <PaymentOptions price={prod.precio} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
