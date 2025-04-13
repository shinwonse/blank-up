'use client'

import { useCallback, useState } from 'react'
import { CSVData } from '@/utils/csv-parser'
import { Upload } from 'lucide-react'

interface CSVUploaderProps {
  onUpload: (data: CSVData, file: File) => void
}

export function CSVUploader({ onUpload }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'text/csv') {
      setError('CSV 파일만 업로드 가능합니다')
      return
    }

    try {
      const text = await file.text()
      const rows = text.split('\n').map(row => row.split(','))
      const headers = rows[0]
      const data = rows.slice(1).filter(row => row.length === headers.length)

      onUpload({ headers, rows: data }, file)
      setError(null)
    } catch {
      setError('파일을 읽는 중 오류가 발생했습니다')
    }
  }, [onUpload])

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
    if (file) handleFile(file)
  }, [handleFile])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="w-full">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging
            ? 'border-pink-500 bg-pink-50'
            : 'border-gray-300 hover:border-pink-300 hover:bg-pink-50/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          className="hidden"
          id="file-upload"
          onChange={handleFileInput}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragging ? '파일을 놓으세요' : '파일을 선택하거나 여기에 드래그하세요'}
            </p>
          </div>
        </label>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  )
} 