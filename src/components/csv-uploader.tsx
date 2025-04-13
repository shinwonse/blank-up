'use client'

import { useState, useCallback, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { FileSpreadsheet, Upload, X } from 'lucide-react'
import { parseCSV, CSVData } from '@/utils/csv-parser'

interface CSVUploaderProps {
  onUpload: (data: CSVData) => void
}

export function CSVUploader({ onUpload }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [csvData, setCSVData] = useState<CSVData | null>(null)

  const handleFile = useCallback(async (file: File) => {
    try {
      if (file.type !== 'text/csv') {
        throw new Error('CSV 파일만 업로드 가능합니다')
      }

      const text = await file.text()
      const data = parseCSV(text)
      
      if (!data || data.rows.length === 0) {
        throw new Error('CSV 파일이 비어있거나 올바른 형식이 아닙니다')
      }

      setFileName(file.name)
      setCSVData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 처리 중 오류가 발생했습니다')
      setFileName(null)
      setCSVData(null)
    }
  }, [])

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
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      const rows = lines.slice(1).map(line => line.split(','))
      
      onUpload({ headers, rows })
    }
    reader.readAsText(file)
  }

  const handleNext = useCallback(() => {
    if (csvData) {
      onUpload(csvData)
    }
  }, [csvData, onUpload])

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center
          transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-pink-500 bg-pink-50' 
            : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
            <Upload className="h-8 w-8 text-pink-500" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              {fileName || 'CSV 파일을 여기에 드래그하세요'}
            </p>
            <p className="text-sm text-gray-500">
              또는 클릭하여 파일을 선택하세요
            </p>
          </div>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
          <X className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {fileName && (
        <div className="mt-4 flex items-center gap-2 text-green-500 bg-green-50 p-3 rounded-lg">
          <FileSpreadsheet className="h-5 w-5" />
          <span>{fileName}</span>
        </div>
      )}

      {csvData && (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleNext} className="w-full max-w-xs">
            다음 단계로
          </Button>
        </div>
      )}
    </div>
  )
} 