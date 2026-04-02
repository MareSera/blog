/**
 * 字体转换脚本：将 public/fonts/ 下的 TTF 文件批量转换为 WOFF2 格式
 * 用法：tsx scripts/convert-fonts.ts
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, basename, extname } from 'node:path'

interface FontConversionResult {
  input: string
  output: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

async function convertFont(ttfPath: string): Promise<FontConversionResult> {
  // ttf2woff2 导出为 { default: fn }
  const { createRequire } = await import('node:module')
  const require = createRequire(import.meta.url)
  const mod = require('ttf2woff2')
  const ttf2woff2 = mod.default ?? mod

  const input = readFileSync(ttfPath)
  const output: Buffer = Buffer.from(ttf2woff2(input) as Uint8Array)

  const woff2Path = ttfPath.replace(/\.ttf$/i, '.woff2')
  writeFileSync(woff2Path, output)

  const originalSize = input.length
  const compressedSize = output.length
  const compressionRatio = Number(((1 - compressedSize / originalSize) * 100).toFixed(1))

  return {
    input: ttfPath,
    output: woff2Path,
    originalSize,
    compressedSize,
    compressionRatio,
  }
}

async function convertAllFonts(fontsDir: string): Promise<FontConversionResult[]> {
  const results: FontConversionResult[] = []

  let files: string[]
  try {
    files = readdirSync(fontsDir)
  }
  catch {
    console.warn(`[convert-fonts] 目录不存在或无法读取：${fontsDir}`)
    return results
  }

  const ttfFiles = files.filter(f => extname(f).toLowerCase() === '.ttf')

  if (ttfFiles.length === 0) {
    console.log('[convert-fonts] 未找到 TTF 文件，跳过转换。')
    return results
  }

  for (const file of ttfFiles) {
    const ttfPath = join(fontsDir, file)
    try {
      const result = await convertFont(ttfPath)
      results.push(result)
      console.log(
        `[convert-fonts] ✓ ${basename(result.input)} → ${basename(result.output)}`
        + ` (${(result.originalSize / 1024).toFixed(1)}KB → ${(result.compressedSize / 1024).toFixed(1)}KB, -${result.compressionRatio}%)`,
      )
    }
    catch (err) {
      console.error(`[convert-fonts] ✗ 转换失败：${file}`, err)
    }
  }

  const totalOriginal = results.reduce((s, r) => s + r.originalSize, 0)
  const totalCompressed = results.reduce((s, r) => s + r.compressedSize, 0)
  const overallRatio = totalOriginal > 0
    ? Number(((1 - totalCompressed / totalOriginal) * 100).toFixed(1))
    : 0

  console.log(
    `\n[convert-fonts] 完成：${results.length} 个文件`
    + ` | 总计 ${(totalOriginal / 1024).toFixed(1)}KB → ${(totalCompressed / 1024).toFixed(1)}KB (-${overallRatio}%)`,
  )

  return results
}

// 直接运行时执行转换
const fontsDir = join(process.cwd(), 'public', 'fonts')
convertAllFonts(fontsDir)
