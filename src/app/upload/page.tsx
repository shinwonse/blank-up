'use client'

import { useRouter } from 'next/navigation'
import { CSVUploader } from '@/components/csv-uploader'
import { Button } from '@/components/ui/button'

export default function UploadPage() {
  const router = useRouter()

  const handleUpload = (data: { headers: string[]; rows: string[][] }) => {
    const encodedData = encodeURIComponent(JSON.stringify(data))
    const encodedColumns = encodeURIComponent(JSON.stringify(data.headers))
    router.push(`/quiz/generate?data=${encodedData}&columns=${encodedColumns}`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">CSV 파일 업로드</h1>
          <p className="mt-2 text-gray-600">퀴즈를 생성할 CSV 파일을 업로드하세요</p>
        </div>
        <div className="space-y-4">
          <CSVUploader onUpload={handleUpload} />
          <Button className="w-full" onClick={() => router.push('/')}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
} 