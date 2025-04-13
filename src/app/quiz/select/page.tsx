'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2, Columns } from 'lucide-react'
import Link from 'next/link'
import { CSVData } from '@/utils/csv-parser'

export default function SelectColumnsPage() {
  const searchParams = useSearchParams()
  const [csvData, setCSVData] = useState<CSVData | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const data = searchParams.get('data')
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data))
        setCSVData(parsedData)
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다')
      }
    }
  }, [searchParams])

  const handleColumnSelect = (column: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(col => col !== column)
      } else {
        return [...prev, column]
      }
    })
  }

  const handleNext = () => {
    if (!csvData || selectedColumns.length === 0) return

    const encodedData = encodeURIComponent(JSON.stringify(csvData))
    const encodedColumns = encodeURIComponent(JSON.stringify(selectedColumns))
    window.location.href = `/quiz/generate?data=${encodedData}&columns=${encodedColumns}`
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
        <div className="flex items-center justify-between mb-8">
          <Link href="/upload">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            컬럼 선택
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            빈칸으로 만들고 싶은 컬럼을 선택해주세요
          </p>
        </div>

        <Card className="max-w-2xl mx-auto hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Columns className="h-6 w-6 text-pink-500" />
              <CardTitle>컬럼 목록</CardTitle>
            </div>
            <CardDescription>
              빈칸으로 만들고 싶은 컬럼을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {csvData.headers.map((header, index) => (
                <button
                  key={index}
                  onClick={() => handleColumnSelect(header)}
                  className={`
                    p-4 rounded-lg border-2 text-left
                    transition-all duration-300 ease-in-out
                    ${selectedColumns.includes(header)
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {selectedColumns.includes(header) && (
                      <CheckCircle2 className="h-5 w-5 text-pink-500" />
                    )}
                    <span className="font-medium">{header}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleNext}
            disabled={selectedColumns.length === 0}
            className="w-full max-w-xs"
          >
            퀴즈 생성하기
          </Button>
        </div>

        <div className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">퀴즈 생성 규칙</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-pink-500">1</span>
              </div>
              <h3 className="font-medium mb-2">컬럼 선택</h3>
              <p className="text-gray-600 text-sm">빈칸으로 만들고 싶은 컬럼을 선택하세요</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-purple-500">2</span>
              </div>
              <h3 className="font-medium mb-2">퀴즈 생성</h3>
              <p className="text-gray-600 text-sm">선택한 컬럼이 랜덤하게 빈칸으로 표시됩니다</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 