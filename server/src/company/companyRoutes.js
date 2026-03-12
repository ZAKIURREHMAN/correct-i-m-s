import express from "express";
import { createCompany, updateCompany, deleteCompany, getOrganizations, searchCompanies } from "./companyControllers.js";
import { createSupplier, updateSupplier, deleteSupplier, getSuppliers } from "./companyControllers.js";

const router = express.Router();

router.post("/create", createCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);
router.get("/organizations", getOrganizations);
router.get("/search", searchCompanies);

router.post("/suppliers/:companyId", createSupplier);
router.put("/suppliers/:id", updateSupplier);
router.delete("/suppliers/:id", deleteSupplier);
router.get("/suppliers/:companyId", getSuppliers);

export default router;