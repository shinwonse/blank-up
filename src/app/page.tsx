import { CSVUploader } from './components/csv-uploader'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8">
          Blank Up
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-center mb-4 sm:mb-6 md:mb-8 text-gray-600">
          CSV 파일을 업로드하여 암기 테스트를 시작하세요
        </p>
        <div className="w-full max-w-2xl mx-auto">
          <CSVUploader />
        </div>
      </div>
    </main>
  )
}
