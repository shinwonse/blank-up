'use client'

import { ColumnSelector } from '../components/column-selector'
import { CSVData } from '../utils/csv-parser'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function QuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [csvData, setCSVData] = useState<CSVData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])

  useEffect(() => {
    const data = searchParams.get('data')
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data))
        setCSVData(parsedData)
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      }
    }
  }, [searchParams])

  const handleColumnChange = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    )
  }

  const handleNext = () => {
    if (selectedColumns.length === 0) {
      setError('최소 하나 이상의 컬럼을 선택해주세요.')
      return
    }
    // TODO: 선택된 컬럼 정보를 다음 페이지로 전달
    const encodedColumns = encodeURIComponent(JSON.stringify(selectedColumns))
    router.push(`/quiz/generate?data=${searchParams.get('data')}&columns=${encodedColumns}`)
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-red-500 text-center">
          {error}
        </div>
      </div>
    )
  }

  if (!csvData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-gray-500 text-center">
          데이터를 불러오는 중...
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8">
          Blank Up
        </h1>
        
        <div className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">CSV 파일의 컬럼 목록입니다.</p>
            <p className="text-sm text-gray-500">빈칸으로 만들 컬럼을 선택해주세요.</p>
          </div>
          
          <ColumnSelector
            headers={csvData.headers}
            selectedColumns={selectedColumns}
            onColumnChange={handleColumnChange}
          />
          
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={selectedColumns.length === 0}
            >
              다음으로
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
} 