import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { productService } from "../services/api";
import type { CreateProductDto } from "../types/Api";
import Toast from "./Toast";

const ProductUploader: React.FC = () => {
  const { user } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [newProduct, setNewProduct] = useState<CreateProductDto>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    imageUrl: "",
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setToastMessage("Por favor completa todos los campos obligatorios.");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      };

      await productService.create(productData);
      
      setToastMessage("Producto agregado exitosamente.");
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        imageUrl: "",
      });
    } catch (error: any) {
      setToastMessage(error.response?.data?.message || "Error al agregar producto");
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Subir Productos</h2>
      
      {loading && (
        <div className="mb-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Cargando...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Descripción"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="border rounded px-3 py-2"
          rows={3}
        />
        <input
          type="url"
          placeholder="URL de imagen (opcional)"
          value={newProduct.imageUrl}
          onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
          className="border rounded px-3 py-2"
        />
      </div>
      
      <button
        onClick={handleAddProduct}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Cargando..." : "Agregar Producto"}
      </button>
      
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default ProductUploader;
