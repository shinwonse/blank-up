export interface CSVData {
  headers: string[]
  rows: string[][]
}

export function parseCSV(text: string): CSVData | null {
  try {
    // 줄바꿈으로 분리하고 빈 줄 제거
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) return null // 최소 헤더 + 1개 데이터 행 필요

    // 헤더 추출
    const headers = lines[0].split(',').map(header => header.trim())

    // 데이터 행 파싱
    const rows = lines.slice(1).map(line => {
      // 쉼표로 분리하고 각 셀의 공백 제거
      return line.split(',').map(cell => cell.trim())
    })

    // 모든 행이 같은 수의 컬럼을 가진다면 데이터 반환
    const isValid = rows.every(row => row.length === headers.length)
    return isValid ? { headers, rows } : null
  } catch (error) {
    console.error('CSV 파싱 중 오류 발생:', error)
    return null
  }
} 