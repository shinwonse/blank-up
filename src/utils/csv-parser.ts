export interface CSVData {
  headers: string[]
  rows: string[][]
}

export function parseCSV(text: string): CSVData | null {
  try {
    // 줄바꿈으로 분리하고 빈 줄 제거
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) return null // 최소 헤더 + 1개 데이터 행 필요

    // CSV 파싱 함수
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      let i = 0
      
      while (i < line.length) {
        const char = line[i]
        
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            // 이스케이프된 큰따옴표
            current += '"'
            i += 2
          } else {
            inQuotes = !inQuotes
            i++
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
          i++
        } else {
          current += char
          i++
        }
      }
      
      // 마지막 셀 추가
      result.push(current.trim())
      
      // 큰따옴표로 시작하고 끝나는 경우 제거
      return result.map(cell => {
        if (cell.startsWith('"') && cell.endsWith('"')) {
          return cell.slice(1, -1)
        }
        return cell
      })
    }

    // 헤더 추출
    const headers = parseCSVLine(lines[0])

    // 데이터 행 파싱
    const rows = lines.slice(1).map(line => parseCSVLine(line))

    // 모든 행이 같은 수의 컬럼을 가진다면 데이터 반환
    const isValid = rows.every(row => row.length === headers.length)
    return isValid ? { headers, rows } : null
  } catch (error) {
    console.error('CSV 파싱 중 오류 발생:', error)
    return null
  }
} 