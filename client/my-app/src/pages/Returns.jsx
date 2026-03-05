import React from "react";
import Navbar from "../components/Navbar";
import useOrderById from "../hooks/useOrderById";
import useReturnOrderItem from "../hooks/useReturnOrderItem";
import { useQueryClient } from "@tanstack/react-query";
import BillHeader from "../components/BillHeader";
import { toastSuccess, toastError, toastInfo } from "../lib/toast";

function formatCurrency(n) {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, { style: "currency", currency: "PKR", minimumFractionDigits: 2 });
}

function Returns() {
  const [orderIdInput, setOrderIdInput] = React.useState("");
  const [orderId, setOrderId] = React.useState(null);
  const [qtyByItem, setQtyByItem] = React.useState({});
  const [message, setMessage] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  const [showPreview, setShowPreview] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const queryClient = useQueryClient();
  const { data: order, isLoading, isFetching, isError, error, refetch } = useOrderById(orderId);
  const returnMutation = useReturnOrderItem();

  // Consider query to be actively fetching only if there's a selected orderId
  const isFetchingOrder = Boolean(orderId) && (isLoading || isFetching);

  const onFetchOrder = () => {
    setMessage(null);
    setErrorMsg(null);
    const id = parseInt(orderIdInput, 10);
    if (!id || Number.isNaN(id)) {
      setErrorMsg("Enter a valid order ID");
      setOrderId(null);
      return;
    }
    setOrderId(id);
  };

  const onQtyChange = (orderItemId, value) => {
    setQtyByItem((prev) => ({ ...prev, [orderItemId]: value }));
  };

  const selectedItems = React.useMemo(() => {
    const items = Array.isArray(order?.ordersItems) ? order.ordersItems : [];
    return items
      .map((it) => {
        const rq = parseInt(qtyByItem[it.orderItemId], 10) || 0;
        return { ...it, returnQty: rq };
      })
      .filter((it) => it.returnQty > 0);
  }, [order, qtyByItem]);

  const totalRefund = React.useMemo(() => {
    return selectedItems.reduce((sum, it) => sum + it.returnQty * Number(it.customizePrise || 0), 0);
  }, [selectedItems]);

  const onGenerateReturnBill = () => {
    setMessage(null);
    setErrorMsg(null);
    if (!order) {
      setErrorMsg("Fetch an order first");
      toastError("Fetch an order first");
      return;
    }
    if (selectedItems.length === 0) {
      setErrorMsg("Enter at least one return quantity");
      toastError("Enter at least one return quantity");
      return;
    }
    // Validate each selected item quantity
    for (const it of selectedItems) {
      if (it.returnQty > it.quantity) {
        setErrorMsg("Return quantity exceeds purchased quantity for one or more items");
        toastError("Return quantity exceeds purchased quantity for one or more items");
        return;
      }
      if (it.returnQty <= 0) {
        setErrorMsg("Return quantities must be positive integers");
        toastError("Return quantities must be positive integers");
        return;
      }
    }
    setShowPreview(true);
    toastInfo("Preview generated. Confirm and print.");
  };

  const onConfirmAndPrint = async () => {
    try {
      setIsSaving(true);
      setMessage(null);
      setErrorMsg(null);

      // Process returns sequentially for safety; stop on first error
      for (const it of selectedItems) {
        await returnMutation.mutateAsync({ orderItemId: it.orderItemId, returnQuantity: it.returnQty });
      }

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["orders", "byId", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      await refetch();

      // Ensure the print area stays in DOM during printing
      const prevAfterPrint = window.onafterprint;
      window.onafterprint = () => {
        setShowPreview(false);
        // restore any previous handler
        if (typeof prevAfterPrint === "function") prevAfterPrint();
        window.onafterprint = null;
      };
      window.print();

      setMessage("Return processed and bill printed.");
      toastSuccess("Return processed and bill printed.");
      // Clear inputs for returned items
      setQtyByItem((prev) => {
        const copy = { ...prev };
        selectedItems.forEach((it) => {
          copy[it.orderItemId] = "";
        });
        return copy;
      });
    } catch (e) {
      setErrorMsg(e?.message || "Failed to process return");
      toastError(e?.message || "Failed to process return");
    } finally {
      setIsSaving(false);
    }
  };

  const items = Array.isArray(order?.ordersItems) ? order.ordersItems : [];

  // Map selected items to BillHeader's simplified item format (used for printing)
  const invoiceItems = React.useMemo(() => selectedItems.map((it) => ({
    name: it?.product?.name || `#${it.productId}`,
    hsn: "",
    qty: Number(it.returnQty || 0),
    unitPrice: Number(it.customizePrise || 0),
    igst: 0,
    cess: 0,
  })), [selectedItems]);

  // Seller/From details consistent with PrintBill
  const from = React.useMemo(() => ({
    name: "Mian Adnan & Brothers",
    address: "13-A ground floor Harmain Center 16-Hall Road, Lahore",
    phone: "0300 006401, 03052322066, 0320 1084590",
    email: "",
    website: "",
    gstin: "",
  }), []);

  // Customer/Bill To details derived from order
  const billTo = React.useMemo(() => ({
    name: order?.customer?.name || "",
    address: order?.customer?.address || "",
    phone: order?.customer?.number || order?.customer?.mobile || order?.customer?.phoneNumber || "",
    email: order?.customer?.email || "",
    website: "",
    gstin: "",
  }), [order]);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Print style to focus on bill section only */}
      <style>
        {`
        @media print {
          body * { visibility: hidden; }
          #return-print-area, #return-print-area * { visibility: visible; }
          #return-print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
        `}
      </style>

      <Navbar />

      <div className="pt-8 px-4 sm:px-6 lg:px-8 pb-12 no-print">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">Product Returns</h1>
          <p className="mt-2 text-gray-600">Look up an order and return purchased items.</p>

          <div className="mt-6 p-4 bg-white border border-indigo-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Enter order ID"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                onClick={onFetchOrder}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                disabled={isFetchingOrder || isSaving}
              >
                Fetch Order
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded">{errorMsg}</div>
          )}
          {message && (
            <div className="mt-4 p-3 border border-indigo-300 bg-indigo-50 text-indigo-800 rounded">{message}</div>
          )}

          {/* Order summary */}
          {isFetchingOrder && <div className="mt-6 text-gray-600">Loading order...</div>}
          {isError && !isFetchingOrder && (
            <div className="mt-6 p-3 border border-red-300 bg-red-50 text-red-700 rounded">{error?.message || "Failed to load order"}</div>
          )}

          {order && !isFetchingOrder && (
            <div className="mt-6">
              <div className="p-4 bg-white border border-indigo-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <div><span className="font-medium">Order ID:</span> {order.orderId}</div>
                  <div><span className="font-medium">Customer:</span> {order?.customer?.name || `#${order.customerId}`}</div>
                  <div><span className="font-medium">Items:</span> {items.length}</div>
                  <div><span className="font-medium">Total Price:</span> {formatCurrency(order.totalPrice)}</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="table-scroll bg-white border border-indigo-200 rounded-lg overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-indigo-50 text-indigo-700 uppercase text-xs tracking-wide">
                      <tr>
                        <th className="px-6 py-3 text-left">Item ID</th>
                        <th className="px-6 py-3 text-left">Product</th>
                        <th className="px-6 py-3 text-left">Qty Purchased</th>
                        <th className="px-6 py-3 text-left">Unit Price</th>
                        <th className="px-6 py-3 text-left">SubTotal</th>
                        <th className="px-6 py-3 text-left">Return Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td className="px-6 py-4 text-gray-500" colSpan={6}>No items found for this order.</td>
                        </tr>
                      ) : (
                        items.map((it) => (
                          <tr key={it.orderItemId} className="border-t border-indigo-100 hover:bg-indigo-50 transition-colors">
                            <td className="px-6 py-3">{it.orderItemId}</td>
                            <td className="px-6 py-3">{it?.product?.name || `#${it.productId}`}</td>
                            <td className="px-6 py-3">{it.quantity}</td>
                            <td className="px-6 py-3">{formatCurrency(it.customizePrise)}</td>
                            <td className="px-6 py-3">{formatCurrency(it.subTotal)}</td>
                            <td className="px-6 py-3">
                              <input
                                type="number"
                                min={1}
                                max={it.quantity}
                                value={qtyByItem[it.orderItemId] ?? ""}
                                onChange={(e) => onQtyChange(it.orderItemId, e.target.value)}
                                className="w-24 px-2 py-1 border rounded-md border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                placeholder="0"
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => { setShowPreview(false); setMessage(null); setErrorMsg(null); setQtyByItem({}); }}
                  disabled={isSaving}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-60"
                >
                  ✖ Cancel
                </button>
                <button
                  onClick={onGenerateReturnBill}
                  disabled={isSaving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                >
                  🖨️ Print Return Bill
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 no-print">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg max-h-[88vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Return Bill Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                disabled={isSaving}
                className="px-3 py-1 rounded hover:bg-gray-100"
                aria-label="Close preview"
              >
                ✖
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <BillHeader
                   brandName="PAK SOLAR TRADER"
                   brandSlogan="Billing Made Easier"
                   copyNote="Return Invoice"
                   invoiceNumber={order ? `R-${order.orderId}` : ""}
                   date={new Date().toLocaleDateString()}
                   dueDate={""}
                   poNumber={""}
                   poDate={""}
                   from={from}
                   billTo={billTo}
                   items={invoiceItems}
                   discount={0}
                   totalLabel="Refund Amount"
                 />
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmAndPrint}
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
              >
                Confirm & Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden print area */}
      {showPreview && (
        <div id="return-print-area" className="p-6">
          <div className="max-w-4xl mx-auto">
            <BillHeader
              brandName="PAK SOLAR TRADER"
              brandSlogan="Billing Made Easier"
              copyNote="Return Invoice"
              invoiceNumber={order ? `R-${order.orderId}` : ""}
              date={new Date().toLocaleDateString()}
              dueDate={""}
              poNumber={""}
              poDate={""}
              from={from}
              billTo={billTo}
              items={invoiceItems}
              discount={0}
              totalLabel="Refund Amount"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Returns;
