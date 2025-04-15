"use client";

import React from "react";

interface FormData {
  postalCode: string;
  address: string;
  province: string;
  city: string;
  paymentMethod: string;
  shippingMethod: "Normal" | "Express";
}

type OrderFormProps = {
    formData: FormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  };
  
  function OrderForm({ formData, onChange }: OrderFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos de Envío</h2>

      {[
        { name: "postalCode", label: "Código Postal", placeholder: "Ej: 1234" },
        { name: "address", label: "Dirección", placeholder: "Calle y número" },
        { name: "province", label: "Provincia", placeholder: "Ej: Buenos Aires" },
        { name: "city", label: "Ciudad", placeholder: "Ej: Mar del Plata" },
      ].map(({ name, label, placeholder }) => (
        <div className="space-y-2" key={name}>
          <label htmlFor={name} className="text-sm font-semibold text-gray-800">
            {label}
          </label>
          <input
            type="text"
            name={name}
            placeholder={placeholder}
            value={(formData as any)[name]}
            onChange={onChange}
            className="w-full border p-2 rounded text-gray-700"
          />
        </div>
      ))}

      <div className="space-y-2">
        <label htmlFor="shippingMethod" className="text-sm font-semibold text-gray-800">Método de Envío</label>
        <select
          name="shippingMethod"
          value={formData.shippingMethod}
          onChange={onChange}
          className="w-full border p-2 rounded text-gray-700"
        >
          <option value="Normal">Envío normal</option>
          <option value="Express">Envío express (+5%)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="paymentMethod" className="text-sm font-semibold text-gray-800">Método de Pago</label>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={onChange}
          className="w-full border p-2 rounded text-gray-700"
        >
          <option value="Efectivo al retirar">Efectivo al retirar</option>
        </select>
      </div>
    </div>
  );
};

export default OrderForm;
