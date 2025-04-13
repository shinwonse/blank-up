'use client'

import { CSVData } from '@/utils/csv-parser'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle2, XCircle, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

interface QuizData {
  original: string
  isBlank: boolean
  userAnswer?: string
  isCorrect?: boolean
}

interface QuizResult {
  totalQuestions: number
  correctAnswers: number
  score: number
  incorrectAnswers: Array<{
    rowIndex: number
    cellIndex: number
    userAnswer: string
    correctAnswer: string
  }>
}

export default function GenerateQuizPage() {
  const searchParams = useSearchParams()
  const [csvData, setCSVData] = useState<CSVData | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [quizData, setQuizData] = useState<QuizData[][]>([])
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const data = searchParams.get('data')
    const columns = searchParams.get('columns')
    
    if (data && columns) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data))
        const parsedColumns = JSON.parse(decodeURIComponent(columns))
        setCSVData(parsedData)
        setSelectedColumns(parsedColumns)
        
        // 퀴즈 데이터 생성
        const newQuizData = parsedData.rows.map((row: string[]) => {
          // 선택된 컬럼들의 인덱스 찾기
          const selectedColumnIndices = parsedData.headers
            .map((header: string, index: number) => parsedColumns.includes(header) ? index : -1)
            .filter((index: number) => index !== -1)
          
          // 선택된 컬럼들 중 랜덤하게 하나의 인덱스 선택
          const randomIndex = selectedColumnIndices[Math.floor(Math.random() * selectedColumnIndices.length)]
          
          // 각 셀에 대해 빈칸 여부 설정
          return row.map((cell: string, index: number) => ({
            original: cell,
            isBlank: index === randomIndex
          }))
        })
        
        setQuizData(newQuizData)
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다')
      }
    }
  }, [searchParams])

  const handleAnswerChange = (rowIndex: number, cellIndex: number, value: string) => {
    setQuizData(prev => {
      const newData = [...prev]
      newData[rowIndex] = [...newData[rowIndex]]
      newData[rowIndex][cellIndex] = {
        ...newData[rowIndex][cellIndex],
        userAnswer: value
      }
      return newData
    })
  }

  const handleSubmit = () => {
    if (!quizData.length) return

    let correctAnswers = 0
    const incorrectAnswers: QuizResult['incorrectAnswers'] = []

    const normalizeAnswer = (answer: string) => {
      return answer
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^\w\s]/g, '')
    }

    quizData.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell.isBlank) {
          const normalizedUserAnswer = normalizeAnswer(cell.userAnswer || '')
          const normalizedCorrectAnswer = normalizeAnswer(cell.original)
          
          const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer
          
          if (isCorrect) {
            correctAnswers++
          } else {
            incorrectAnswers.push({
              rowIndex,
              cellIndex,
              userAnswer: cell.userAnswer || '',
              correctAnswer: cell.original
            })
          }
        }
      })
    })

    const totalQuestions = quizData.reduce((count, row) => 
      count + row.filter(cell => cell.isBlank).length, 0
    )

    const score = Math.round((correctAnswers / totalQuestions) * 100)

    setResult({
      totalQuestions,
      correctAnswers,
      score,
      incorrectAnswers
    })
    setIsSubmitted(true)
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

  if (!csvData || !quizData.length) {
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
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 group">
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="transition-colors">홈으로</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            빈칸 퀴즈
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            빈칸을 채워주세요
          </p>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">퀴즈 결과</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-gray-600">총 문제 수</p>
                <p className="text-2xl font-bold text-pink-500">{result.totalQuestions}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-600">정답 수</p>
                <p className="text-2xl font-bold text-purple-500">{result.correctAnswers}</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-gray-600">점수</p>
                <p className="text-2xl font-bold text-pink-500">{result.score}점</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                {csvData.headers.map((header, index) => (
                  <TableHead key={index} className="whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="whitespace-nowrap">
                      {cell.isBlank ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={cell.userAnswer || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleAnswerChange(rowIndex, cellIndex, e.target.value)
                            }
                            placeholder="정답을 입력하세요"
                            className="w-full"
                            disabled={isSubmitted}
                          />
                          {isSubmitted && (
                            cell.userAnswer?.toLowerCase().trim() === cell.original.toLowerCase().trim() ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )
                          )}
                        </div>
                      ) : (
                        cell.original
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitted}
            className="w-full max-w-xs"
          >
            {isSubmitted ? '제출 완료' : '제출하기'}
          </Button>
        </div>

        <div className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">퀴즈 규칙</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-pink-500">1</span>
              </div>
              <h3 className="font-medium mb-2">빈칸 채우기</h3>
              <p className="text-gray-600 text-sm">빈칸에 정답을 입력하세요</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-purple-500">2</span>
              </div>
              <h3 className="font-medium mb-2">정답 확인</h3>
              <p className="text-gray-600 text-sm">제출 후 정답을 확인하세요</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 