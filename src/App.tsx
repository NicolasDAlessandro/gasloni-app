// src/App.tsx
import React from "react";
import ProductUploader from "./components/ProductUploader";
import ProductTable from "./components/ProductTable";
import { CartProvider } from "./context/CartContext";
import './index.css';

const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="p-8 bg-gray-50">
        <h1 className="text-3xl font-bold">Visualizador de Precios</h1>
        <ProductUploader />
        <ProductTable />
      </div>
    </CartProvider>
  );
};

export default App;
