"use client";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SimpleTable({
  columns = [],
  rows = [],
  emptyText = "No data",
}) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className="whitespace-nowrap">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, idx) => (
              <TableRow key={row?._id ?? idx}>
                {columns.map((col) => {
                  const value = row?.[col.key];
                  const content = col.render ? col.render(row) : value;

                  return (
                    <TableCell key={col.key} className="align-top">
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
