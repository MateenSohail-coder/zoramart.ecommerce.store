export const TAX_RATE = 0.05;
export const SHIPPING_FLAT = 99;
export const FREE_SHIPPING_THRESHOLD = 1000;

export function calcSubtotal(items = []) {
  return items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );
}

export function calcShipping(subtotal) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}

export function calcTax(subtotal) {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

export function calcCartTotals(items = [], discount = 0) {
  const subtotal = calcSubtotal(items);
  const shipping = calcShipping(subtotal);
  const tax = calcTax(subtotal);
  const total = Math.max(0, subtotal + shipping + tax - discount);

  return { subtotal, shipping, tax, discount, total };
}

export function enrichCartItems(cart) {
  if (!cart) return null;

  const items = (cart.items || []).map((item) => {
    const product = item.product && typeof item.product === "object" ? item.product : null;
    return {
      productId: product?._id || item.product,
      name: item.name || product?.name,
      price: item.price ?? product?.price ?? 0,
      quantity: item.quantity,
      image: product?.images?.[0] || "",
      stock: product?.stock ?? 0,
      slug: product?.slug,
    };
  });

  const totals = calcCartTotals(items);

  return {
    _id: cart._id,
    buyer: cart.buyer,
    items,
    totalAmount: totals.total,
    ...totals,
  };
}
