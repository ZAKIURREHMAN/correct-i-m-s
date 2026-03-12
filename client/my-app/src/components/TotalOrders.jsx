import React, { useMemo, useState } from "react";
import Navbar from "./Navbar";
import useOrders from "../hooks/useOrders";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function formatCurrency(val) {
  const num = Number(val) || 0;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateTime(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return String(dt);
  return d.toLocaleString();
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function TotalOrders() {
  const navigate = useNavigate()
  const { data: orders, isLoading, isError, error } = useOrders();

  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders.filter(
      (order) =>
        order?.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        String(order?.orderId).includes(search)
    );
  }, [orders, search]);

  const handleRowClick = (order) => {
    const items = Array.isArray(order?.ordersItems) ? order.ordersItems : [];
    const totalQty = items.reduce(
      (sum, it) => sum + (Number(it?.quantity) || 0),
      0
    );
    const itemCount = items.length;

    const cust = order?.customer || {};

    const customerHtml = `
      <div style="margin-bottom:16px;">
        <h3 style="margin:0 0 8px 0;color:#4f46e5;">Customer Details</h3>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;">
          <div><strong>Name:</strong> ${escapeHtml(cust.name)}</div>
          <div><strong>Email:</strong> ${escapeHtml(cust.email)}</div>
          <div><strong>Phone:</strong> ${escapeHtml(cust.number)}</div>
          <div><strong>Address:</strong> ${escapeHtml(cust.address)}</div>
        </div>
      </div>
    `;

    const orderSummaryHtml = `
      <div style="margin-bottom:16px;">
        <h3 style="margin:0 0 8px 0;color:#4f46e5;">Order Summary</h3>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;">
          <div><strong>Items:</strong> ${itemCount}</div>
          <div><strong>Total Qty:</strong> ${totalQty}</div>
          <div><strong>Total Price:</strong> ${escapeHtml(
            formatCurrency(order?.totalPrice)
          )}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px;">
          <div><strong>Created:</strong> ${escapeHtml(
            formatDateTime(order?.createAt)
          )}</div>
          <div><strong>Updated:</strong> ${escapeHtml(
            formatDateTime(order?.updateAt)
          )}</div>
        </div>
      </div>
    `;

    const itemsHead = `
      <thead style="background:#eef2ff;color:#4338ca;text-transform:uppercase;font-size:12px;">
        <tr>
          <th style="padding:8px 12px;text-align:left;">Item ID</th>
          <th style="padding:8px 12px;text-align:left;">Product</th>
          <th style="padding:8px 12px;text-align:left;">Quantity</th>
          <th style="padding:8px 12px;text-align:left;">Customize Price</th>
          <th style="padding:8px 12px;text-align:left;">SubTotal</th>
          <th style="padding:8px 12px;text-align:left;">Created</th>
        </tr>
      </thead>
    `;

    const itemsRows = items
      .map((it) => {
        const pid = escapeHtml(it?.orderItemId);
        const pname = escapeHtml(it?.product?.name || `#${it?.productId}`);
        const qty = escapeHtml(it?.quantity);
        const cp = escapeHtml(formatCurrency(it?.customizePrise));
        const st = escapeHtml(formatCurrency(it?.subTotal));
        const ct = escapeHtml(formatDateTime(it?.createAt));

        return `
          <tr style="border-top:1px solid #e0e7ff;">
            <td style="padding:8px 12px;">${pid}</td>
            <td style="padding:8px 12px;">${pname}</td>
            <td style="padding:8px 12px;">${qty}</td>
            <td style="padding:8px 12px;">${cp}</td>
            <td style="padding:8px 12px;">${st}</td>
            <td style="padding:8px 12px;">${ct}</td>
          </tr>
        `;
      })
      .join("");

    const itemsTable =
      items.length === 0
        ? '<p style="color:#4b5563;">No items in this order.</p>'
        : `
        <div style="max-height:45vh;overflow:auto;">
          <table style="width:100%;font-size:14px;color:#111827;">
          ${itemsHead}
          <tbody>${itemsRows}</tbody>
          </table>
        </div>
      `;

    const html = `
      <div style="text-align:left;">
        ${customerHtml}
        ${orderSummaryHtml}
        <div>
          <h3 style="margin:8px 0;color:#4f46e5;">Order Items</h3>
          ${itemsTable}
        </div>
      </div>
    `;

    Swal.fire({
      title: `Order #${order.orderId} — Details`,
      width: "64rem",
      html,
      showCancelButton: true,
      confirmButtonText: "Buy New Product",
      cancelButtonText: "Close",
    }).then((success)=>{ 
      if(success.isConfirmed){ 
        navigate(`/order-items/new?customerId=${order?.customerId || order?.customer?.customerId || ""}`); 
      } 
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />

      <div className="mt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Total Orders</h2>

          <input
            type="text"
            placeholder="Search order or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="table-scroll bg-white shadow-sm rounded-xl border border-indigo-200">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading orders…</div>
          ) : isError ? (
            <div className="p-6 text-center text-red-600">
              {error?.message || "Failed to load orders"}
            </div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-indigo-50 text-indigo-700 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total Qty</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Created</th>
                  {/* <th className="px-6 py-3">Updated</th> */}
                </tr>
              </thead>

              <tbody>
                {rows.map((order) => {
                  const items = Array.isArray(order?.ordersItems)
                    ? order.ordersItems
                    : [];

                  const itemCount = items.length;

                  const totalQty = items.reduce(
                    (sum, it) => sum + (Number(it?.quantity) || 0),
                    0
                  );

                  return (
                    <tr
                      key={order.orderId}
                      className="border-t border-indigo-100 hover:bg-indigo-50 cursor-pointer transition-colors"
                      title="Click to view details"
                      onClick={() => handleRowClick(order)}
                    >
                      <td className="px-6 py-3">{order.orderId}</td>
                      <td className="px-6 py-3">
                        {order?.customerId || order?.customer?.customerId || "-"}
                      </td>
                      <td className="px-6 py-3">
                        {order?.customer?.name || "-"}
                      </td>
                      <td className="px-6 py-3">{itemCount}</td>
                      <td className="px-6 py-3">{totalQty}</td>
                      <td className="px-6 py-3 font-semibold">
                        {formatCurrency(order?.totalPrice)}
                      </td>
                      <td className="px-6 py-3">
                        {formatDateTime(order?.createAt)}
                      </td>
                      {/* <td className="px-6 py-3">
                        {formatDateTime(order?.updateAt)}
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default TotalOrders;
