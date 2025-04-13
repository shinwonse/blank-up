'use client'

import { CSVData } from '../utils/csv-parser'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CSVTableProps {
  data: CSVData
}

export function CSVTable({ data }: CSVTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {data.headers.map((header, index) => (
              <TableHead key={index} className="whitespace-nowrap">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="whitespace-nowrap">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 