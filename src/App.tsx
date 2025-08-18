// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductUploader from "./components/ProductUploader";
import ProductTable from "./components/ProductTable";
import Cart from "./components/Cart";
import NavButton from "./components/NavButton";
import CreatePayment from "./components/CreatePayment";
import UpdatePayments from "./components/UpdatePayments";
import BudgetStats from "./components/BudgetStats";
import RegisterSeller from "./components/RegisterSeller";
import { CartProvider } from "./context/CartContext";
import './index.css';

// Placeholder components for new routes
const Billing: React.FC = () => <div className="p-8">Billing Page (to be implemented)</div>;
const Invoice: React.FC = () => <div className="p-8">Invoice Page (to be implemented)</div>;

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div className="p-8 bg-gray-50">
          <NavButton />
          <Routes>
            <Route path="/" element={
              <>
                <ProductTable />
              </>
            } />
            <Route path="/upload" element={<ProductUploader />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/create-payment" element={<CreatePayment />} />
            <Route path="/update-payment" element={<UpdatePayments />} />
            <Route path="/budget-stats" element={<BudgetStats />} />
            <Route path="/register-seller" element={<RegisterSeller />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
