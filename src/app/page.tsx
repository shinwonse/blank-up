'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, FileSpreadsheet, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Blank Up
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            CSV 파일로 쉽고 빠르게 빈칸 퀴즈를 만들어보세요!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6 text-pink-500" />
                <CardTitle>CSV 파일 업로드</CardTitle>
              </div>
              <CardDescription>
                CSV 파일을 업로드하고 빈칸 퀴즈를 만들어보세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/upload">
                <Button className="w-full">
                  시작하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-500" />
                <CardTitle>빈칸 퀴즈 생성</CardTitle>
              </div>
              <CardDescription>
                선택한 컬럼을 빈칸으로 만들어 퀴즈를 풀어보세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/quiz">
                <Button className="w-full" variant="outline">
                  퀴즈 풀기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">빈칸 퀴즈 만들기 3단계</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-pink-500">1</span>
              </div>
              <h3 className="font-medium mb-2">CSV 파일 업로드</h3>
              <p className="text-gray-600 text-sm">퀴즈로 만들고 싶은 CSV 파일을 선택하세요</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-purple-500">2</span>
              </div>
              <h3 className="font-medium mb-2">빈칸 컬럼 선택</h3>
              <p className="text-gray-600 text-sm">빈칸으로 만들고 싶은 컬럼을 선택하세요</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-pink-500">3</span>
              </div>
              <h3 className="font-medium mb-2">퀴즈 풀기</h3>
              <p className="text-gray-600 text-sm">생성된 퀴즈를 풀고 점수를 확인하세요</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
