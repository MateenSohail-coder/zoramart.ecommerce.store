import { connectDB } from "@/lib/connectdb";
import Order from "@/models/order";
import Payment from "@/models/payment";

function toDateRangeDays(days) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return { start, end: now };
}

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const daysRaw = searchParams.get("days");
  const days = Math.max(7, Math.min(90, Number(daysRaw || "30")));

  const { start, end } = toDateRangeDays(days);

  // Revenue time series (payments)
  const revenueAgg = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: "$createdAt",
            unit: "day",
          },
        },
        revenue: { $sum: "$amountPaid" },
        refunded: {
          $sum: {
            $cond: [{ $eq: ["$paymentStatus", "Refunded"] }, "$amountPaid", 0],
          },
        },
        payments: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Orders time series
  const ordersAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: "$createdAt",
            unit: "day",
          },
        },
        orders: { $sum: 1 },
        gmv: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Totals for stats
  const totals = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          gmv: { $sum: "$totalAmount" },
        },
      },
    ]),
    Payment.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          payments: { $sum: 1 },
          revenue: { $sum: "$amountPaid" },
          refundedRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", "Refunded"] },
                "$amountPaid",
                0,
              ],
            },
          },
        },
      },
    ]),
  ]);

  const [ordersTotals] = totals;
  const [, paymentsTotals] = totals;

  const totalOrders = ordersTotals?.orders ?? 0;
  const totalGmv = ordersTotals?.gmv ?? 0;

  const totalPayments = paymentsTotals?.payments ?? 0;
  const totalRevenue = paymentsTotals?.revenue ?? 0;
  const refundedRevenue = paymentsTotals?.refundedRevenue ?? 0;

  const refundRate =
    totalRevenue > 0 ? (refundedRevenue / totalRevenue) * 100 : 0;
  const aov = totalOrders > 0 ? totalGmv / totalOrders : 0;

  // Merge daily time series into one array for charting
  const byDay = new Map();
  for (const row of revenueAgg) {
    const day = row._id?._id ?? row._id; // depends on dateTrunc nesting
    const key = new Date(day).toISOString().slice(0, 10);
    byDay.set(key, {
      date: key,
      revenue: row.revenue ?? 0,
      refundedRevenue: row.refunded ?? 0,
      payments: row.payments ?? 0,
      orders: 0,
      gmv: 0,
    });
  }
  for (const row of ordersAgg) {
    const day = row._id?._id ?? row._id;
    const key = new Date(day).toISOString().slice(0, 10);
    const existing = byDay.get(key) || {
      date: key,
      revenue: 0,
      refundedRevenue: 0,
      payments: 0,
      orders: 0,
      gmv: 0,
    };
    existing.orders = row.orders ?? 0;
    existing.gmv = row.gmv ?? 0;
    byDay.set(key, existing);
  }

  // Ensure chronological order and include empty days
  const chart = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    chart.push(
      byDay.get(key) || {
        date: key,
        revenue: 0,
        refundedRevenue: 0,
        payments: 0,
        orders: 0,
        gmv: 0,
      },
    );
  }

  return Response.json({
    range: { start, end, days },
    totals: {
      orders: totalOrders,
      payments: totalPayments,
      revenue: totalRevenue,
      aov,
      refundRate,
    },
    chart,
  });
}
