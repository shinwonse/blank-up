'use client'

import { useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { parseCSV } from '../utils/csv-parser'
import { useRouter } from 'next/navigation'

export function CSVUploader() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (selectedFile: File) => {
    try {
      const data = await parseCSV(selectedFile)
      const encodedData = encodeURIComponent(JSON.stringify(data))
      router.push(`/quiz?data=${encodedData}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'CSV 파일을 파싱하는 중 오류가 발생했습니다.')
    }
  }, [router])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile)
      handleFile(droppedFile)
    }
  }, [handleFile])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      handleFile(selectedFile)
    }
  }, [handleFile])

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-6">
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400 mb-2 sm:mb-3 md:mb-4" />
          <p className="text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-3 md:mb-4 text-center">
            CSV 파일을 드래그하거나 선택하세요
          </p>
          <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-3 sm:mb-4 text-center">
            .csv 파일만 업로드 가능합니다
          </p>
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            파일 선택
          </Button>
          
          {file && (
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 text-center break-all">
              선택된 파일: {file.name}
            </div>
          )}
        </div>
      </Card>

      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  )
} 