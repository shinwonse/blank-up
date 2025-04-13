export interface CSVData {
  headers: string[]
  rows: string[][]
}

export async function parseCSV(file: File): Promise<CSVData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split('\n').map(line => line.trim()).filter(line => line)
        
        if (lines.length === 0) {
          throw new Error('CSV 파일이 비어있습니다.')
        }
        
        const headers = lines[0].split(',').map(header => header.trim())
        const rows = lines.slice(1).map(line => 
          line.split(',').map(cell => cell.trim())
        )
        
        resolve({ headers, rows })
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('파일을 읽는 중 오류가 발생했습니다.'))
    }
    
    reader.readAsText(file)
  })
} 