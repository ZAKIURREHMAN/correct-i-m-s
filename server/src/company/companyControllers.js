import { createCompany as createCompanyHandler, updateCompany as updateCompanyHandler, deleteCompany as deleteCompanyHandler, getOrganizations as getOrganizationsHandler } from "./companyHandlers.js";
import { createSupplier as createSupplierHandler, updateSupplier as updateSupplierHandler, deleteSupplier as deleteSupplierHandler, getSuppliers as getSuppliersHandler } from "./companyHandlers.js";

export const createCompany = async (req, res) => {
  try {
    const { name , address, number , email  } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ message: "name,   and email are required" });
    }

    const company = await createCompanyHandler({ name, address, number, email });
    if (company?.status) {
      return res.status(company.status).json({ message: company.message });
    }

    return res.status(201).json({ company });
  } catch (err) {
    console.error("createCompany error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const idParam = req.params.id;
    const companyId = parseInt(idParam);
    const { name, address, number, email } = req.body || {};

    const company = await updateCompanyHandler({ companyId, name, address, number, email });
    if (company?.status) {
      return res.status(company.status).json({ message: company.message });
    }

    return res.status(200).json({ company });
  } catch (err) {
    console.error("updateCompany error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const idParam = req.params.id;
    const companyId = parseInt(idParam);
      const  company = await deleteCompanyHandler({ companyId });
    if (company?.status) {
      return res.status(company.status).json({ message: company.message });
    }

    return res.status(200).json({ company });
  } catch (err) {
    console.error("deleteCompany error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrganizations = async (_req, res) => {
  try {
    const companies = await getOrganizationsHandler();
    return res.status(200).json({ companies });
  } catch (err) {
    console.error("getOrganizations error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Suppliers controllers
export const createSupplier = async (req, res) => {
  try {
    const idParam = req.params.companyId;
    const companyId = parseInt(idParam);

    const { name, address, number, email  } = req.body || {};
 
    const supplier = await createSupplierHandler({ companyId, name, address, number, email });
 
    if (supplier?.status) {
      return res.status(supplier.status).json({ message: supplier.message, data:supplier });
    }
    return res.status(201).json({ data:"We are facing some errors"});
  } catch (err) {
    console.error("createSupplier error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const idParam = req.params.id;
    const supplierId = parseInt(idParam);
    const { name, address, number, email } = req.body || {};

    const supplier = await updateSupplierHandler({ supplierId, name, address, number, email });
    if (supplier?.status) {
      return res.status(supplier.status).json({ message: supplier.message });
    }

    return res.status(200).json({ supplier });
  } catch (err) {
    console.error("updateSupplier error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const idParam = req.params.id;
    const supplierId = parseInt(idParam);
 
    const supplier = await deleteSupplierHandler({ supplierId });
    if (supplier?.status) {
      return res.status(supplier.status).json({ message: supplier.message });
    }

    return res.status(200).json({ supplier });
  } catch (err) {
    console.error("deleteSupplier error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const idParam = req.params.companyId;
    const companyId = parseInt(idParam );
 
    const result = await getSuppliersHandler({ companyId });
    if (result?.status) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({ suppliers: result });
  } catch (err) {
    console.error("getSuppliers error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};