import React from 'react'

function BillHeader({
  // Branding + meta
  brandName = 'PAK SOLAR TRADERS',
  brandSlogan = 'Billing Made Easier',
  copyNote = 'Original for Recipient',
  invoiceNumber = '',
  date = new Date().toLocaleDateString(),
  dueDate = '',
  poNumber = '',
  poDate = '',
  // Parties
  from = {},
  billTo = {},
  // Items + totals
  items = [],
  discount = 0,
  totalLabel = 'Total Amount',
}) {
  const numberFmt = (n) => {
    const num = Number(n || 0)
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Icons for various labels and fields
  const Icon = {
    copy: '📄',
    invoice: '🧾',
    date: '📅',
    due: '⏰',
    po: '📝',

    name: '👤',
    address: '📍',
    phone: '📞',
    email: '✉️',
    website: '🌐',
    gstin: '🧾',

    number: '',
    product: '',
    qty: '',
    unit: '',
    amount: '',

    beforeTax: '',
    discount: '',
    totalTax: '',
    total: '',
    note: '',
  }

  const computed = items.map((it) => {
    const qty = Number(it.qty || it.quantity || 0)
    const unit = Number(it.unitPrice || it.price || it.customizePrice || 0)
    const amount = qty * unit 
    return { name: it.name || it.productName || '', qty, unit, amount }
  })

  const totalBeforeTax = computed.reduce((s, r) => s + r.qty * r.unit, 0)
  const grandTotal = totalBeforeTax - Number(discount || 0) 

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">{brandName}</h1>
            <p className="text-gray-500 text-sm">{brandSlogan}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">{Icon.copy} {copyNote}</p>
            <h2 className="text-1xl font-bold text-blue-600">
              {Icon.invoice} {invoiceNumber ? `ORDER ID:  ${invoiceNumber}` : 'ORDER ID: '}
            </h2>
            <p className="text-sm mt-2">{Icon.date} Date: {date}</p>
            <p className="text-sm">{dueDate ? <><span>{Icon.due} </span>Due Date: {dueDate}</> : ''}</p>
            <p className="text-sm">{poNumber ? <><span>{Icon.po} </span>P.O. Number: {poNumber}</> : ''}</p>
            <p className="text-sm">{poDate ? <><span>{Icon.date} </span>P.O. Date: {poDate}</> : ''}</p>
          </div>
        </div>

        {/* Address Section */}
        <div className="grid grid-cols-2 gap-10 mt-6 border-b pb-6">
          {/* From */}
          <div>
            <h3 className="font-semibold text-blue-600 mb-2">
              {from.name || ''}
            </h3>
            <p className="text-sm text-gray-700">
              {from.address ? (<><span className="mr-2">{Icon.address}</span>{from.address}<br /></>) : null}
              {from.phone ? (<><span className="mr-2">{Icon.phone}</span>{from.phone}<br /></>) : null}
              {from.email ? (<><span className="mr-2">{Icon.email}</span>{from.email}<br /></>) : null}
              {from.website ? (<><span className="mr-2">{Icon.website}</span>{from.website}<br /></>) : null}
              {from.gstin ? (<><span className="mr-2">{Icon.gstin}</span>GSTIN: {from.gstin}</>) : null}
            </p>
          </div>

          {/* Bill To */}
          <div>
            <h3 className="font-semibold text-blue-600 mb-2">
              Bill To:
            </h3>
            <p className="text-sm text-gray-700">
              {billTo.name ? (<><span className="mr-2">{Icon.name}</span>{billTo.name}<br /></>) : null}
              {billTo.address ? (<><span className="mr-2">{Icon.address}</span>{billTo.address}<br /></>) : null}
              {billTo.phone ? (<><span className="mr-2">{Icon.phone}</span>{billTo.phone}<br /></>) : null}
              {billTo.contactPerson ? (<><span className="mr-2">{Icon.name}</span>{billTo.contactPerson}<br /></>) : null}
              {billTo.gstin ? (<><span className="mr-2">{Icon.gstin}</span>GSTIN: {billTo.gstin}</>) : null}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">{Icon.number} No</th>
                <th className="p-3 text-left">{Icon.product} Product</th>
                {/* <th className="p-3 text-left">HSN</th> */}
                <th className="p-3 text-left">{Icon.qty} Qty</th>
                <th className="p-3 text-left">{Icon.unit} Unit Price</th>
                 <th className="p-3 text-left">{Icon.amount} Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {computed.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">
                    {row.name}
                    <p className="text-xs text-gray-500">
                      {/* Keep placeholder for optional product description if you pass one */}
                    </p>
                  </td>
                  {/* <td className="p-3">{row.hsn || ''}</td> */}
                  <td className="p-3">{row.qty}</td>
                  <td className="p-3">{numberFmt(row.unit)}</td>
                   <td className="p-3 font-semibold">{numberFmt(row.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-8">
          <div className="w-80 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{Icon.beforeTax} Total Before Tax</span>
              <span>{numberFmt(totalBeforeTax)}</span>
            </div>

            <div className="flex justify-between">
              <span>{Icon.discount} Discount</span>
              <span>-{discount ? ` ${numberFmt(discount)}` : ''}</span>
            </div>

            <div className="flex justify-between">
              <span>{Icon.totalTax} Total Tax Amount</span>
             </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>{Icon.total} {totalLabel}</span>
              <span>PKR {numberFmt(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t pt-6 text-sm text-gray-600">
          <p className="font-semibold">{Icon.note} Note:</p>
          <p>
            Please note that all products are fragile and need to be
            transported with caution.
          </p>
          <p>
            If invoice has not been paid in 5 days after due date, a tax
            of 10% of total value is applied to each day of delay.
          </p>
        </div>

      </div>
    </div>
   )
}

export default BillHeader
