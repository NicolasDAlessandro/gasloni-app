import React, { useEffect, useMemo, useState } from "react";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";
import PaymentOptions from "./PaymentOptions";
import CartModal from "./CartModal";
import NavButton from "./NavButton";

const ProductTable: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);


  // IMPORTANTE: useCart expone 'items' y 'totalItems' (no 'cart')
  const { add, totalItems } = useCart();

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
  };

  const toggleExpand = (codigo: string) => {
    setExpandedRow((prev) => (prev === codigo ? null : codigo));
  };

  return (
    <div className="mt-4 relative">
      {/* Botón carrito */}
      <button
        onClick={() => setShowCart(true)}
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200"
        aria-label="Abrir carrito"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 4h1.5L9 16h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zm-8.5-3h9.25L19 7H7.312"
          />
        </svg>

        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {totalItems}
          </span>
        )}
      </button>

      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSubmit={handleSubmit}
        handleClear={handleClear}
      />
      <NavButton onOpen={() => setShowCart(true)} />

      {/* Información de productos */}
      <div className="text-sm text-gray-600 mb-2 px-2">
        Productos totales: {allProducts.length} — Mostrando: {filteredProducts.length}
      </div>

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

      {/* Modal carrito */}
      <CartModal open={showCart} onClose={() => setShowCart(false)} />
        
    </div>
  );
};

export default ProductTable;
