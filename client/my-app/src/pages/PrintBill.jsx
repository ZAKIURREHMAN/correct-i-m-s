import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useCustomerById from "../hooks/useCustomerById";
import useCreateOrder from "../hooks/useCreateOrder";
import useCreateOrderItem from "../hooks/useCreateOrderItem";
import BillHeader from "../components/BillHeader";
import { toastSuccess, toastError } from "../lib/toast";

function PrintBill() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const customerId = state.customerId ? parseInt(state.customerId, 10) : null;
  const items = Array.isArray(state.items) ? state.items : [];
  const grandTotal = typeof state.grandTotal === "number" ? state.grandTotal : items.reduce((s, it) => s + (Number(it.quantity||0) * Number(it.customizePrice||0)), 0);

  const { data: customer, isLoading: customerLoading } = useCustomerById(customerId);

  const createOrder = useCreateOrder();
  const createOrderItem = useCreateOrderItem();
  const queryClient = useQueryClient();

  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");
  const [billOrderId, setBillOrderId] = React.useState(state?.orderId ? String(state.orderId) : "");
  const [paidAmount, setPaidAmount] = React.useState(grandTotal); // Default to full payment

  React.useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = "@media print { .no-print { display: none !important; } body { background: white; } }";
    document.head.appendChild(styleEl);
    return () => {
      if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);


  const onConfirmAndSave = async () => {
    if (!customerId || items.length === 0) return;
    
    // Validate payment amount
    if (paidAmount < 0) {
      setSaveError("Paid amount cannot be negative");
      toastError("Paid amount cannot be negative");
      return;
    }
    
    if (paidAmount > grandTotal) {
      setSaveError("Paid amount cannot exceed total bill");
      toastError("Paid amount cannot exceed total bill");
      return;
    }
    
    setSaveError("");
    setSaving(true);
    try {
      const orderRes = await createOrder.mutateAsync({ 
        customerId, 
        totalPrice: Math.round(grandTotal),
        paidAmount: Math.round(paidAmount)
      });
      const orderId = orderRes?.data?.orderId;
      const isExistingOrder = orderRes?.data?.existingOrder;
      
      if (!orderId) {
        throw new Error("Failed to create order");
      }

      for (const it of items) {
        await createOrderItem.mutateAsync({
          orderId,
          productId: it.productId,
          customerId,
          customizePrise: Math.round(Number(it.customizePrice)||0),
          quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
          subTotal: Math.round((Number(it.quantity)||0) * (Number(it.customizePrice)||0))
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.refetchQueries({ queryKey: ["orders"] });

      setBillOrderId(String(orderId));
      setSaving(false);
      
      if (isExistingOrder) {
        toastSuccess("Order items added to existing order. Printing bill...");
      } else {
        toastSuccess("New order created. Printing bill...");
      }
      
      // Wait a tick so the DOM updates the displayed Order ID before printing
      await new Promise((resolve) => setTimeout(resolve, 100));
      window.print();
      navigate("/admin-dashboard");
    } catch (e) {
      setSaving(false);
      setSaveError(e?.message || "Failed to save order");
      toastError(e?.message || "Failed to save order");
    }
  };

  if (!customerId || items.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-lg w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No bill data</h2>
          <p className="text-gray-600 mb-6">Go back and select a customer and products to create a bill.</p>
          <button
            className="px-4 py-2 border border-indigo-600 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            onClick={() => navigate(-1)}
          >
            🔙 Back
          </button>
        </div>
      </div>
    );
  }

  // Map items into BillHeader's table format (HSN/IGST/CESS left as 0 or empty)
  const invoiceItems = items.map((it) => ({
    name: it.productName || `#${it.productId}`,
    hsn: "",
    qty: Number(it.quantity || 0),
    unitPrice: Number(it.customizePrice || 0),
    igst: 0,
    cess: 0,
  }));

  // Seller/From details (keep consistent brand used in header design)
  const from = {
    name: "Mian Adnan & Brothers",
    address: "13-A ground floor Harmain Center 16-Hall Road, Lahore",
    phone: "0300 006401, 03052322066, 0320 1084590",
    email: "",
    website: "",
    gstin: "",
  };

  const billTo = {
    name: customer?.name || "",
    address: customer?.address || "",
    phone: customer?.number || "",
    contactPerson: "",
    gstin: "",
  };

  return (
    <div className="min-h-screen w-full bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <BillHeader
          brandName="PAK SOLAR TRADER"
          brandSlogan="Billing Made Easier"
          copyNote="Original for Recipient"
          invoiceNumber={billOrderId}
          date={new Date().toLocaleDateString()}
          dueDate=""
          poNumber=""
          poDate=""
          from={from}
          billTo={billTo}
          items={invoiceItems}
          discount={0}
          paidAmount={paidAmount}
          pendingAmount={grandTotal - paidAmount}
        />
      </div>

      {saveError && (
        <p className="mt-3 text-sm text-red-600">{saveError}</p>
      )}

      <div className="mt-6 flex items-center justify-between no-print">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          ❌ Cancel
        </button>
        
        {/* Payment Input Section */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label htmlFor="paidAmount" className="text-sm font-medium text-gray-700 mb-1">
              Amount Paid (PKR)
            </label>
            <input
              id="paidAmount"
              type="number"
              min="0"
              max={grandTotal}
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter amount paid"
              disabled={saving || customerLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Total Bill: PKR {grandTotal.toLocaleString()}
            </p>
            {paidAmount < grandTotal && (
              <p className="text-xs text-orange-600 mt-1">
                Pending: PKR {(grandTotal - paidAmount).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onConfirmAndSave}
            disabled={saving || customerLoading}
            className="px-4 py-2 border border-indigo-600 text-indigo-700 rounded-lg hover:bg-indigo-50 disabled:opacity-60"
          >
            🖨️ Print
          </button>
          <button
            onClick={onConfirmAndSave}
            disabled={saving || customerLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "💾 Saving..." : "💾 Confirm & Save"}
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default PrintBill;