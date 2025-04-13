'use client'

import { Suspense, useEffect, useState } from 'react'
import { CSVData } from '@/utils/csv-parser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

function QuizSelectContent() {
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])

  useEffect(() => {
    try {
      // localStorage에서 데이터 가져오기
      const data = localStorage.getItem('csvData')
      if (data) {
        const parsedData = JSON.parse(data)
        setCsvData(parsedData)
      }
    } catch (err) {
      console.error('Error parsing CSV data:', err)
    }
  }, [])

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(col => col !== column)
      } else {
        return [...prev, column]
      }
    })
  }

  const handleGenerateQuiz = () => {
    if (selectedColumns.length === 0) return

    try {
      // 선택된 컬럼을 localStorage에 저장
      localStorage.setItem('selectedColumns', JSON.stringify(selectedColumns))
      window.location.href = '/quiz/generate'
    } catch {
      console.error('데이터 처리 중 오류가 발생했습니다')
    }
  }

  if (!csvData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">데이터를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="w-full max-w-5xl">

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            컬럼 선택
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            빈칸으로 만들고 싶은 컬럼을 선택해주세요
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-12">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-pink-500" />
                <CardTitle>컬럼 선택</CardTitle>
              </div>
              <CardDescription>
                빈칸으로 만들고 싶은 컬럼을 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {csvData.headers.map((header, index) => (
                  <Button
                    key={index}
                    variant={selectedColumns.includes(header) ? 'default' : 'outline'}
                    className="flex items-center gap-2"
                    onClick={() => handleColumnToggle(header)}
                  >
                    {selectedColumns.includes(header) && <Check className="h-4 w-4" />}
                    {header}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8 text-center">
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
                <p className="text-gray-600 text-sm">선택한 컬럼 중 하나가 랜덤하게 빈칸으로 생성됩니다</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              >
                이전
              </Button>
            </Link>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              onClick={handleGenerateQuiz}
              disabled={selectedColumns.length === 0}
            >
              퀴즈 생성하기
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function QuizSelectPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    }>
      <QuizSelectContent />
    </Suspense>
  )
} 