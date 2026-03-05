import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import useOrganizations from "../hooks/useOrganizations";
import useProductsByCompany from "../hooks/useProductsByCompany";
import useCreateOrder from "../hooks/useCreateOrder";
import useCreateOrderItem from "../hooks/useCreateOrderItem";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toastError, toastInfo } from '../lib/toast'

function OrderItemRow({
  index,
  item,
  companies,
  onItemChange,
  onRemove,
  canRemove,
}) {
  const { companyId, productId, quantity, customizePrice } = item;
  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsErr,
  } = useProductsByCompany(companyId);
  const productsError = productsErr ? productsErr.message : null;

  const itemSubtotal = Number(quantity || 0) * Number(customizePrice || 0);

  const handleCompanyChange = (e) => {
    const value = e.target.value;
    const company = companies.find((c) => String(c.companyId) === String(value));
    const companyName = company ? company.name : "";
    // Reset product and price when company changes
    onItemChange(index, { companyId: value, companyName, productId: "", productName: "", customizePrice: 0 });
  };

  const handleProductChange = (e) => {
    const value = e.target.value;
    const prod = products.find((p) => String(p.productId) === String(value));
    const defaultPrice = prod && typeof prod.sellingPrice !== "undefined" ? prod.sellingPrice : 0;
    const productName = prod ? prod.name : "";
    onItemChange(index, { productId: value, productName, customizePrice: defaultPrice });
  };

  const handleQuantityChange = (e) => {
    onItemChange(index, { quantity: e.target.value });
  };

  const handleCustomizePriceChange = (e) => {
    onItemChange(index, { customizePrice: e.target.value });
  };

  return (
    <div className="p-4 border rounded-lg border-indigo-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <select
            value={companyId}
            onChange={handleCompanyChange}
            className="w-full px-3 py-2 border rounded-lg border-indigo-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">Select a company</option>
            {companies.map((c) => (
              <option key={c.companyId} value={c.companyId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select
            value={productId}
            onChange={handleProductChange}
            disabled={!companyId || productsLoading}
            className="w-full px-3 py-2 border rounded-lg border-indigo-300 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
          >
            {!companyId ? (
              <option value="">Select a company first</option>
            ) : productsLoading ? (
              <option>Loading products...</option>
            ) : productsError ? (
              <option disabled>{productsError}</option>
            ) : products.length === 0 ? (
              <option value="">No products found</option>
            ) : (
              <>
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.name} (Qty: {p.quantity})
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full px-3 py-2 border rounded-lg border-indigo-300 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Custom Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={customizePrice}
            onChange={handleCustomizePriceChange}
            className="w-full px-3 py-2 border rounded-lg border-indigo-300 focus:border-indigo-500 focus:outline-none"
            placeholder="Defaults to selling price"
          />
        </div>

        {/* Subtotal (computed) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
          <input
            type="text"
            disabled
            value={(Number(quantity || 0) * Number(customizePrice || 0)).toFixed(2)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
          />
        </div>
      </div>

      {canRemove && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="px-3 py-1.5 border border-red-600 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

function CreateOrderItem() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const customerIdFromQuery = search.get("customerId") || "";

  const [customerId, setCustomerId] = React.useState(customerIdFromQuery || "");
  const [items, setItems] = React.useState([
    { companyId: "", companyName: "", productId: "", productName: "", quantity: 1, customizePrice: 0 },
  ]);

  useEffect(() => {
    if (customerIdFromQuery) setCustomerId(customerIdFromQuery);
  }, [customerIdFromQuery]);

  // Organizations
  const { getOrganizations } = useOrganizations();
  const [companies, setCompanies] = React.useState([]);
  const [companiesError, setCompaniesError] = React.useState(null);
  const [companiesLoading, setCompaniesLoading] = React.useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setCompaniesLoading(true);
        const data = await getOrganizations();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        setCompaniesError(err?.message || "Failed to load organizations");
        toastError(err?.message || "Failed to load organizations");
      } finally {
        setCompaniesLoading(false);
      }
    };
    loadCompanies();
  }, []);

  // Derived totals
  const itemSubtotal = (it) => Number(it.quantity || 0) * Number(it.customizePrice || 0);
  const grandTotal = items.reduce((sum, it) => sum + itemSubtotal(it), 0);

  const onReset = () => {
    setItems([{ companyId: "", companyName: "", productId: "", productName: "", quantity: 1, customizePrice: 0 }]);
  };

  const addItem = () => {
    setItems((prev) => [...prev, { companyId: "", companyName: "", productId: "", productName: "", quantity: 1, customizePrice: 0 }]);
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const onItemChange = (idx, patch) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  };

  const onPreviewBill = () => {
    const cId = parseInt(customerId, 10);
    if (!cId) {
      toastError('Select a customer before previewing');
      return;
    }

    const validItems = items.filter(
      (it) => parseInt(it.productId, 10) && Number(it.quantity) > 0
    );
    if (validItems.length === 0) {
      toastError('Add at least one valid product and quantity');
      return;
    }

    const roundedTotal = Math.round(grandTotal);

    const enriched = validItems.map((it) => ({
      companyId: parseInt(it.companyId, 10),
      companyName: it.companyName || "",
      productId: parseInt(it.productId, 10),
      productName: it.productName || "",
      quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
      customizePrice: Number(it.customizePrice) || 0,
    }));

    toastInfo('Previewing bill...');
    navigate("/print-bill", {
      state: {
        customerId: cId,
        items: enriched,
        grandTotal: roundedTotal,
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />

      <div className="pt-8 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mt-20  mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Create Order</h1>
            <p className="mt-2 text-gray-600">
              Select a company, add one or more products, then preview and confirm the bill.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-indigo-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-lg">
              <h2 className="text-white font-medium">Order Details</h2>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                  <input
                    type="text"
                    value={customerId || ""}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-6">
                {items.map((it, idx) => (
                  <OrderItemRow
                    key={idx}
                    index={idx}
                    item={it}
                    companies={companies}
                    onItemChange={onItemChange}
                    onRemove={removeItem}
                    canRemove={items.length > 1}
                  />
                ))}
              </div>

              {/* Add product and totals */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 border border-indigo-600 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                >
                  Add Another Product
                </button>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Grand Total</p>
                  <p className="text-xl font-semibold text-gray-800">{grandTotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-indigo-600 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                >
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onReset()}
                    className="px-4 py-2 border border-indigo-600 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={onPreviewBill}
                    disabled={items.length === 0}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Preview Bill
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Fields: company, products, quantities, custom prices. Total auto-computed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderItem;