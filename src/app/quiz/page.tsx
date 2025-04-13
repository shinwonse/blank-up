'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function QuizForm() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const data = searchParams.get('data')
  let parsedData
  try {
    parsedData = data ? JSON.parse(decodeURIComponent(data)) : null
  } catch {
    setError('CSV 파일을 파싱하는 중 오류가 발생했습니다')
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
          퀴즈
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6">
          빈칸을 채워주세요
        </p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {parsedData.headers.map((header: string, index: number) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parsedData.rows.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: string, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <QuizForm />
      </Suspense>
    </main>
  )
} 