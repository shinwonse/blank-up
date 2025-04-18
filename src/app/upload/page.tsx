'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CSVUploader } from '@/components/csv-uploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileSpreadsheet, Upload, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { CSVData } from '@/utils/csv-parser'

export default function UploadPage() {
  const router = useRouter()
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileUpload = (data: CSVData, file: File) => {
    setCsvData(data)
    setFileName(file.name)
  }

  const handleNext = () => {
    if (!csvData) return

    try {
      // localStorage에 데이터 저장
      localStorage.setItem('csvData', JSON.stringify(csvData))
      router.push('/quiz/select')
    } catch {
      console.error('데이터 처리 중 오류가 발생했습니다')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            CSV 파일 업로드
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            퀴즈로 만들고 싶은 CSV 파일을 선택해주세요
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-12">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6 text-pink-500" />
                <CardTitle>파일 선택</CardTitle>
              </div>
              <CardDescription>
                CSV 파일을 드래그 앤 드롭하거나 클릭하여 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <CSVUploader onUpload={handleFileUpload} />
                {fileName && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{fileName}</span>
                  </div>
                )}
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>CSV 파일만 업로드 가능합니다</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">CSV 파일 준비하기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-pink-500">1</span>
                </div>
                <h3 className="font-medium mb-2">파일 형식</h3>
                <p className="text-gray-600 text-sm">첫 번째 행은 컬럼 이름이어야 합니다</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-purple-500">2</span>
                </div>
                <h3 className="font-medium mb-2">데이터 정리</h3>
                <p className="text-gray-600 text-sm">빈칸으로 만들고 싶은 컬럼의 데이터를 정리해주세요</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white space-x-2"
              >
                <span>이전</span>
              </Button>
            </Link>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white space-x-2"
              onClick={handleNext}
              disabled={!csvData}
            >
              <span>다음</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
} 