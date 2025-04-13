'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'

function SelectForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const data = searchParams.get('data')
  let parsedData
  try {
    parsedData = data ? JSON.parse(decodeURIComponent(data)) : null
  } catch {
    setError('데이터를 불러오는 중 오류가 발생했습니다')
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        {error}
      </div>
    )
  }

  if (!parsedData) {
    return (
      <div className="text-gray-500 text-center">
        데이터를 불러오는 중...
      </div>
    )
  }

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    )
  }

  const handleNext = () => {
    if (selectedColumns.length === 0) {
      setError('최소 하나의 컬럼을 선택해주세요')
      return
    }

    const encodedColumns = encodeURIComponent(JSON.stringify(selectedColumns))
    router.push(`/quiz/generate?data=${data}&columns=${encodedColumns}`)
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900 group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="transition-colors">홈으로</span>
          </Button>
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          빈칸으로 만들 컬럼 선택
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6">
          빈칸으로 만들고 싶은 컬럼을 선택해주세요
        </p>
      </div>

      <div className="space-y-6">
        {parsedData.headers.map((header: string) => (
          <div key={header} className="flex items-center space-x-2">
            <Checkbox
              id={header}
              checked={selectedColumns.includes(header)}
              onCheckedChange={() => handleColumnToggle(header)}
            />
            <label
              htmlFor={header}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {header}
            </label>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleNext} className="space-x-2">
          <span>다음</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function SelectPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <SelectForm />
      </Suspense>
    </main>
  )
} 