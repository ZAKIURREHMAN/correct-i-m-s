import React, { useState } from "react";
import useOrganizations from "../hooks/useOrganizations";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useCreateSupplier from "../hooks/useCreateSupplier"
import useCreateProduct from "../hooks/useCreateProduct"
import Navbar from "./Navbar";

function SupplierWithProducts() {
  const [showProductInput, setShowProductInput] = useState(1);
  const [supplier,setSupplier] = useState('')
  const {createProduct} = useCreateProduct()
  const [supplierId,setSupplierId] = useState('')
  const {createSupplier} = useCreateSupplier()
  const { getOrganizations } = useOrganizations();
  const { data } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  const callSupplierApi = (e) => {
    const {name,value} = e.target
    setSupplier((p)=>({
      ...p,
      [name]:value
    }))
  };
  const { register, handleSubmit,reset } = useForm();

  const mutation = useMutation({
    mutationFn:(data)=>createSupplier(data),
    onSuccess:(data)=>{
      setSupplierId(data?.data?.data?.supplierId)
    }
  })

  const onSubmit = async (formData) => {
  try {
    const supplierRes = await mutation.mutateAsync(supplier);
    const newSupplierId = supplierRes?.data?.data?.supplierId;
    if (!newSupplierId) return;
    if (formData?.products?.length > 0) {
      await Promise.all(
        formData.products.map((product) =>
          createProduct({
            ...product,
            supplierId: newSupplierId,
          })
        )
      );
    }
   reset();
    setShowProductInput(1);

  } catch (error) {
    console.log(error);
  }
};

  const makeEmptyArray = Array.from({ length: showProductInput }).fill("");


  return (
    <>
    <Navbar />
    <div className=" w-full h-screen ">
      <div className=" bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-indigo-100 ">
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
                Supplier Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  className=" green-input border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
                  name="companyId"
                  onChange={callSupplierApi}
                  >
                  <option value="0"> Select your company </option>
                  {data?.map((company) => (
                    <option
                    key={company.companyId}
                    value={company.companyId}
                    className=" green-input border-1 h-[45px] text-center rounded-3xl  "
                    >
                      {company.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Supplier Name"
                  className="green-input  border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  name="name"
                  onChange={callSupplierApi}
                  />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="green-input  border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  name="number"
                  onChange={callSupplierApi}
                  />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="green-input  border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  name="email"
                  onChange={callSupplierApi}
                  />
                <input
                  placeholder="Address"
                  className="green-input md:col-span-2 resize-none  border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  name="address"
                  onChange={callSupplierApi}
                  />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
                Products
              </h2>

              <form className=" max-h-[300px] overflow-y-auto pr-2 ">
                {makeEmptyArray?.map((item, index) => (
                  <div key={index} className="space-y-8 mt-7 h-full overflow-y-auto flex-1  "
                  >
                     <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition duration-300">
                       <span className="absolute mt-[-30px] right-4 text-sm bg-indigo-600 text-white px-3 py-1 rounded-full shadow">
                         Product #{index + 1}
                       </span>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <input
                           type="text"
                           placeholder="Product Name"
                           className="green-input  border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                           {...register(`products.${index}.name`)}
                           />
                         <input
                           type="text"
                           placeholder="Warranty"
                           className="green-input  border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                           {...register(`products.${index}.warranty`)}
                           />
                         <input
                           type="number"
                           placeholder="Quantity"
                           className="green-input  border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                           {...register(`products.${index}.quantity`, {
                             valueAsNumber: true,
                            })}
                            />

                         <input
                           type="number"
                           placeholder="Buy Price"
                           className="green-input  border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                           {...register(`products.${index}.buyPrice`, {
                             valueAsNumber: true,
                            })}
                            />
                         <input
                           type="number"
                           placeholder="Selling Price"
                           className="green-input  border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                           {...register(`products.${index}.sellingPrice`, {
                             valueAsNumber: true,
                            })}
                            />
                         <input
                           type="number"
                           placeholder="Alert Quantity"
                           className="green-input  border-1 h-[45px] text-center rounded-3xl border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                           {...register(`products.${index}.alert`, {
                             valueAsNumber: true,
                            })}
                            />
                       </div>
                     </div>
                   </div>
                ))}
              </form>

              {/* ADD BUTTON */}
              <button
                className="mt-8 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition duration-300 shadow-sm cursor-pointer "
                onClick={() => setShowProductInput(showProductInput + 1)}
                >
                + Add Another Product
              </button>
            </div>

            {/* SAVE BUTTON */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit(onSubmit)}
                className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                >
                Save Supplier & Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
                </>
  );
}

export default SupplierWithProducts;