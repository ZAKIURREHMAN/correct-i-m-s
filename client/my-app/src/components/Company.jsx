import React, { useState } from "react";
import Navbar from "./Navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useOrganizations from "../hooks/useOrganizations";
import useDeleteCompany from "../hooks/useDeleteCompany";
import Swal from "sweetalert2";
import RegisterCompany from "../pages/RegisterCompany";
import UpdateCompany from "../pages/UpdateCompany";
import { toastSuccess, toastError } from "../lib/toast";
import { apiUrl } from "../lib/api";

function Company() {
  const { getOrganizations } = useOrganizations();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Search companies function
  const searchCompanies = async (query) => {
    const res = await fetch(apiUrl(`company/search?query=${encodeURIComponent(query)}`));
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || "Failed to search companies");
    }
    return data.companies || [];
  };

  // Fetch companies with search
  const {
    data: companies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["organizations", searchQuery],
    queryFn: () => searchQuery ? searchCompanies(searchQuery) : getOrganizations(),
  });

  // Delete company API
  const { deleteCompany: deleteCompanyRequest } = useDeleteCompany();

  const { mutate: deleteCompany, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteCompanyRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });

      Swal.fire({
        title: "Deleted!",
        text: "Company has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#fff',
        iconColor: '#ef4444',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      toastSuccess("Company deleted successfully");
    },
    onError: (err) => {
      Swal.fire({
        title: "Error!",
        text: err?.message || "Failed to delete company",
        icon: "error",
        background: '#1f2937',
        color: '#fff',
        iconColor: '#ef4444',
      });
      toastError(err?.message || "Failed to delete company");
    },
  });

  // SweetAlert2 Delete Confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: '#1f2937',
      color: '#fff',
      iconColor: '#f59e0b',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCompany(id);
      }
    });
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setEditOpen(true);
  };

  // New: Update a single product (quantity, buyPrice, sellingPrice)
  const updateProduct = async ({ productId, quantity, buyPrice, sellingPrice }) => {
    const res = await fetch(apiUrl(`products/${productId}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity, buyPrice, sellingPrice }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || "Failed to update product");
    }
    return data;
  };

  const handleRowClick = async (company) => {
    const id = company.id ?? company.companyId;
    await Swal.fire({
      title: `<span style="font-size: 24px; font-weight: 600; color: #fff;">${company.name} — Products</span>`,
      width: "95vw",
      background: '#1f2937',
      color: '#fff',
      html: `
        <div id="products-modal-content" class="text-left" style="color: #e5e7eb;">
          <div style="display: flex; justify-content: center; padding: 40px;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid rgba(99, 102, 241, 0.3); border-radius: 50%; border-top-color: #6366f1; animation: spin 1s ease-in-out infinite;"></div>
          </div>
          <p style="text-align: center; color: #9ca3af;">Loading products...</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#6366f1",
      didOpen: async () => {
        try {
          const res = await fetch(apiUrl(`products/by-company/${id}`));
          const data = await res.json().catch(() => null);
          if (!res.ok) {
            throw new Error(data?.message || "Failed to load products");
          }
          const products = Array.isArray(data?.data) ? data.data : [];

          const escapeHtml = (str) =>
            String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");

          const tableHead = `
            <thead style="background:#374151; color:#f3f4f6; text-transform:uppercase; font-size:12px; letter-spacing:0.5px; border-radius: 12px 12px 0 0;">
              <tr>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">ID</th>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">Name</th>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">Warranty</th>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">Quantity</th>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">Buy Price</th>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">Selling Price</th>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">Alert</th>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">Supplier</th>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">Number</th>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">Address</th>
                <th style="padding:12px 16px; text-align:left; font-weight:600;">Actions</th>
              </tr>
            </thead>`;

          const rows = products
            .map((p) => {
              const pid = escapeHtml(p.productId);
              const name = escapeHtml(p.name);
              const warranty = escapeHtml(p.warranty);
              const qty = escapeHtml(p.quantity);
              const buy = escapeHtml(p.buyPrice);
              const sell = escapeHtml(p.sellingPrice);
              const alert = escapeHtml(p.alert);
              const supplierName = escapeHtml(p?.supplier?.name);
              const supplierNumber = escapeHtml(p?.supplier?.number);
              const supplierAddress = escapeHtml(p?.supplier?.address);

              return `
                <tr data-product-id="${pid}" style="border-bottom:1px solid #374151; transition: all 0.3s ease; background: #2d3748;" 
                    onmouseover="this.style.background='#374151'" onmouseout="this.style.background='#2d3748'">
                  <td style="padding:12px 16px; color: #e5e7eb;">${pid}</td>
                  <td style="padding:12px 16px; color: #fff; font-weight: 500;">${name}</td>
                  <td style="padding:12px 16px; color: #e5e7eb;">
                    <span style="background: #4b5563; padding: 4px 8px; border-radius: 20px; font-size: 11px;">${warranty}</span>
                  </td>
                  <td style="padding:12px 16px;">
                    <input type="number" min="0" step="1" value="${qty}" class="prod-input qty" 
                      style="width:90px; padding:8px 12px; background:#374151; border:1px solid #4b5563; border-radius:8px; color:#fff; font-size:13px; transition: all 0.2s;"
                      onfocus="this.style.borderColor='#6366f1'; this.style.outline='none'"
                      onblur="this.style.borderColor='#4b5563'" />
                  </td>
                  <td style="padding:12px 16px;">
                    <input type="number" min="0" step="0.01" value="${buy}" class="prod-input buy" 
                      style="width:110px; padding:8px 12px; background:#374151; border:1px solid #4b5563; border-radius:8px; color:#fff; font-size:13px;"
                      onfocus="this.style.borderColor='#6366f1'; this.style.outline='none'"
                      onblur="this.style.borderColor='#4b5563'" />
                  </td>
                  <td style="padding:12px 16px;">
                    <input type="number" min="0" step="0.01" value="${sell}" class="prod-input sell" 
                      style="width:120px; padding:8px 12px; background:#374151; border:1px solid #4b5563; border-radius:8px; color:#fff; font-size:13px;"
                      onfocus="this.style.borderColor='#6366f1'; this.style.outline='none'"
                      onblur="this.style.borderColor='#4b5563'" />
                  </td>
                  <td style="padding:12px 16px;">
                    <span style="background: ${Number(alert) > 10 ? '#10b981' : '#ef4444'}; padding: 4px 8px; border-radius: 20px; font-size: 11px; color: white;">${alert}</span>
                  </td>
                  <td style="padding:12px 16px; color: #e5e7eb;">${supplierName || '—'}</td>
                  <td style="padding:12px 16px; color: #e5e7eb;">${supplierNumber || '—'}</td>
                  <td style="padding:12px 16px; color: #e5e7eb;">${supplierAddress || '—'}</td>
                  <td style="padding:12px 16px;">
                    <button class="save-product-btn" 
                      style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color:white; padding:8px 16px; border-radius:8px; border:none; cursor:pointer; font-size:13px; font-weight:500; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(16,185,129,0.2)'"
                      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                      💾 Save
                    </button>
                  </td>
                </tr>`;
            })
            .join("");

          const html =
            products.length === 0
              ? '<div style="text-align: center; padding: 40px; color: #9ca3af; font-size: 16px;">📦 No products found for this company</div>'
              : `
                  <div style="max-height:60vh; overflow:auto; border-radius: 12px; background: #2d3748; border: 1px solid #374151;">
                    <table style="width:100%; font-size:14px; border-collapse: collapse;">${tableHead}<tbody>${rows}</tbody></table>
                  </div>
                `;

          Swal.update({ 
            html,
            background: '#1f2937',
            color: '#fff'
          });

          // Attach save handlers after DOM is rendered
          const container = Swal.getHtmlContainer();
          if (container) {
            const buttons = container.querySelectorAll('.save-product-btn');
            buttons.forEach((btn) => {
              btn.addEventListener('click', async (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                
                const row = ev.currentTarget.closest('tr[data-product-id]');
                if (!row) return;
                
                const productId = row.getAttribute('data-product-id');
                const qtyEl = row.querySelector('input.qty');
                const buyEl = row.querySelector('input.buy');
                const sellEl = row.querySelector('input.sell');
                
                const payload = {
                  productId,
                  quantity: Number(qtyEl?.value || 0),
                  buyPrice: Number(buyEl?.value || 0),
                  sellingPrice: Number(sellEl?.value || 0),
                };
                
                const originalText = ev.currentTarget.innerHTML;
                ev.currentTarget.innerHTML = '⏳ Saving...';
                ev.currentTarget.disabled = true;
                ev.currentTarget.style.opacity = '0.7';
                
                try {
                  await updateProduct(payload);
                  // Invalidate products caches across the app
                  queryClient.invalidateQueries({ queryKey: ['products'] });
                  queryClient.invalidateQueries({ queryKey: ['products', 'list'] });
                  queryClient.invalidateQueries({ queryKey: ['products', 'byCompany', id] });

                  // Visual feedback
                  row.style.background = 'linear-gradient(135deg, #065f46 0%, #047857 100%)';
                  setTimeout(() => { 
                    row.style.background = '#2d3748';
                  }, 500);

                  Swal.fire({
                    icon: 'success',
                    title: '✅ Product updated successfully!',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1f2937',
                    color: '#fff',
                    iconColor: '#10b981',
                    position: 'top-end',
                    toast: true,
                    showClass: {
                      popup: 'animate__animated animate__fadeInRight'
                    },
                    hideClass: {
                      popup: 'animate__animated animate__fadeOutRight'
                    }
                  });
                  toastSuccess('Product updated successfully');
                } catch (err) {
                  Swal.fire({
                    icon: 'error',
                    title: '❌ Update failed',
                    text: err?.message || 'Unable to update product',
                    background: '#1f2937',
                    color: '#fff',
                    iconColor: '#ef4444',
                  });
                  toastError(err?.message || 'Unable to update product');
                } finally {
                  ev.currentTarget.innerHTML = originalText;
                  ev.currentTarget.disabled = false;
                  ev.currentTarget.style.opacity = '1';
                }
              });
            });
          }
        } catch (err) {
          Swal.update({ 
            html: `<div style="text-align: center; padding: 40px; color: #ef4444;">❌ ${err?.message || "Failed to load products"}</div>`,
            background: '#1f2937',
            color: '#fff'
          });
        }
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative mt-10 px-4 md:px-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Company Management
            </h2>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
              Manage and oversee all registered companies
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by ID, name, or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>

            <button
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => setOpen(true)}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-xl">+</span>
                Register New Company
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <span className="text-2xl">🏢</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Companies</p>
                <p className="text-2xl font-bold text-gray-800">{companies.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-2xl font-bold text-gray-800">
                  {companies.filter(c => c.status !== 'inactive').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">This Month</p>
                <p className="text-2xl font-bold text-gray-800">
                  {companies.filter(c => {
                    const date = new Date(c.createdAt);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 border border-white/50 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Top Rated</p>
                <p className="text-2xl font-bold text-gray-800">24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              {/* Table Head */}
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Company Name</th>
                  <th className="px-6 py-4 font-semibold">Address</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600">Loading organizations...</span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-red-500">
                      ❌ {error?.message || "Failed to load organizations"}
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">🏢</span>
                        <p>No organizations found</p>
                        <button
                          onClick={() => setOpen(true)}
                          className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          + Register your first company
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  companies.map((company, index) => {
                    const id = company.id ?? company.companyId;
                    const number = company.number ?? company.phone ?? company.contactNumber ?? "";
                    const created = company.createdAt ?? company.createAt ?? "";

                    return (
                      <tr
                        key={id}
                        className="hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer group"
                        onClick={() => handleRowClick(company)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">#{id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold">
                                {company.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">{company.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">📍</span>
                            {company.address}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                            <span className="text-gray-600">📞</span>
                            {number}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <span className="text-gray-400">✉️</span>
                            {company.email}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {created ? new Date(created).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(company);
                              }}
                              className="p-2 hover:bg-indigo-100 rounded-lg transition-all group/edit"
                              title="Edit company"
                            >
                              <i className="fa-solid fa-pen-to-square text-indigo-600 text-lg group-hover/edit:scale-110 transition-transform"></i>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(id);
                              }}
                              className={`p-2 hover:bg-red-100 rounded-lg transition-all group/delete ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
                              title="Delete company"
                            >
                              <i className="fa-solid fa-trash text-red-500 text-lg group-hover/delete:scale-110 transition-transform"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {open && <RegisterCompany open={open} setOpen={setOpen} />}
      {editOpen && selectedCompany && (
        <UpdateCompany open={editOpen} setOpen={setEditOpen} company={selectedCompany} />
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Company;