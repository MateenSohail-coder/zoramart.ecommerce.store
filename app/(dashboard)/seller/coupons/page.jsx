"use client";

import * as React from "react";
import SimpleTable from "../../_components/SimpleTable";

export default function SellerCouponsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Coupons</h2>

      <SimpleTable
        columns={[
          { key: "code", label: "Code" },
          { key: "discount", label: "Discount" },
          { key: "minOrder", label: "Min Order" },
          { key: "expiresAt", label: "Expires" },
        ]}
        rows={[]}
        emptyText="No coupons found."
      />

      <div className="text-xs text-gray-500">
        Coupon APIs are not implemented in this repo yet.
      </div>
    </div>
  );
}

