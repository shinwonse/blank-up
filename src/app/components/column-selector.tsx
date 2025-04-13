'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

interface ColumnSelectorProps {
  headers: string[]
  selectedColumns: string[]
  onColumnChange: (column: string) => void
}

export function ColumnSelector({ headers, selectedColumns, onColumnChange }: ColumnSelectorProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">빈칸으로 만들 컬럼 선택</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {headers.map((header) => (
          <div key={header} className="flex items-center space-x-2">
            <Checkbox
              id={header}
              checked={selectedColumns.includes(header)}
              onCheckedChange={() => onColumnChange(header)}
            />
            <Label htmlFor={header} className="text-sm">
              {header}
            </Label>
          </div>
        ))}
      </div>
    </Card>
  )
} 