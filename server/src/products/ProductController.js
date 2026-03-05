import {
  productHandler,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getProductsByCompanyId,
} from "./ProductHandler.js";

export const createProduct = async (req, res) => {
  try {
    const {supplierId} = req.params;
    if (!supplierId) {
      return res.status(400).json({ message: "supplierId is required" });
    }
    const supplierIdInt = parseInt(supplierId);
    const { name, warranty, buyPrice, sellingPrice, quantity, alert } =
      req.body;
    const createProduct = await productHandler({
      name,
      warranty,
      buyPrice,
      sellingPrice,
      quantity,
      alert,
      supplierId:supplierIdInt,
    });
    return res.status(createProduct.status).json(createProduct);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const pid = parseInt(productId, 10);
    if (!pid || Number.isNaN(pid)) {
      return res.status(400).json({ message: "valid productId is required" });
    }
    const { name, warranty, buyPrice, sellingPrice, quantity, alert } =
      req.body || {};

    // Coerce numeric fields if provided
    const bp = buyPrice !== undefined ? parseInt(buyPrice, 10) : undefined;
    const sp = sellingPrice !== undefined ? parseInt(sellingPrice, 10) : undefined;
    const qty = quantity !== undefined ? parseInt(quantity, 10) : undefined;

    const result = await updateProduct({
      name,
      warranty,
      buyPrice: bp,
      sellingPrice: sp,
      quantity: qty,
      alert,
      productId: pid,
    });
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // Avoid name shadowing: call the handler and store in a different variable
    const result = await getAllProduct();
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getProductsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const companyIdInt = parseInt(companyId, 10);
    if (!companyId || Number.isNaN(companyIdInt)) {
      return res.status(400).json({ message: "valid companyId is required" });
    }
    const result = await getProductsByCompanyId({ companyId: companyIdInt });
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
