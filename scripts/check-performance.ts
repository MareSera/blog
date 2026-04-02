/**
 * 性能检测脚本
 * 使用 Lighthouse Node.js API 对本地构建产物进行性能测试
 * 用法：pnpm perf（需要先运行 pnpm preview 启动本地服务器）
 */

const TARGET_URL = process.env.PERF_URL || 'http://localhost:4321'

// 性能指标阈值（参考 Google 推荐值）
const THRESHOLDS = {
  lcp: 2500,   // LCP < 2.5s 为 Good
  cls: 0.1,    // CLS < 0.1 为 Good
  fcp: 1800,   // FCP < 1.8s 为 Good
  ttfb: 800,   // TTFB < 800ms 为 Good
  performance: 90, // Lighthouse 性能分数 >= 90
}

interface MetricResult {
  name: string
  value: number | null
  unit: string
  threshold: number
  status: 'good' | 'needs-improvement' | 'poor' | 'unknown'
}

function getStatus(value: number | null, threshold: number, lowerIsBetter = true): MetricResult['status'] {
  if (value === null) return 'unknown'
  if (lowerIsBetter) {
    return value <= threshold ? 'good' : value <= threshold * 1.5 ? 'needs-improvement' : 'poor'
  }
  return value >= threshold ? 'good' : value >= threshold * 0.8 ? 'needs-improvement' : 'poor'
}

function formatValue(value: number | null, unit: string): string {
  if (value === null) return 'N/A'
  if (unit === 'ms') return `${Math.round(value)}ms`
  if (unit === 's') return `${(value / 1000).toFixed(2)}s`
  if (unit === 'score') return `${Math.round(value)}`
  return `${value}`
}

function statusIcon(status: MetricResult['status']): string {
  switch (status) {
    case 'good': return '✅'
    case 'needs-improvement': return '⚠️'
    case 'poor': return '❌'
    default: return '❓'
  }
}

async function runLighthouse(url: string) {
  let lighthouse: any
  let chromeLauncher: any

  try {
    // 动态导入，避免在没有安装时报错
    // @ts-ignore - lighthouse 是可选依赖，运行时动态导入
    const lighthouseModule = await import('lighthouse')
    lighthouse = lighthouseModule.default || lighthouseModule
    // @ts-ignore - chrome-launcher 是可选依赖，运行时动态导入
    chromeLauncher = await import('chrome-launcher')
  }
  catch {
    console.error('❌ 未找到 lighthouse 或 chrome-launcher，请先安装：')
    console.error('   pnpm add -D lighthouse chrome-launcher')
    process.exit(1)
  }

  console.log(`\n🔍 正在对 ${url} 进行性能测试...\n`)

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] })

  try {
    const options = {
      logLevel: 'error' as const,
      output: 'json' as const,
      onlyCategories: ['performance'],
      port: chrome.port,
    }

    const runnerResult = await lighthouse(url, options)
    const report = runnerResult?.lhr

    if (!report) {
      console.error('❌ Lighthouse 未返回报告')
      return
    }

    const audits = report.audits
    const categories = report.categories

    const metrics: MetricResult[] = [
      {
        name: 'Performance Score',
        value: categories.performance?.score != null ? categories.performance.score * 100 : null,
        unit: 'score',
        threshold: THRESHOLDS.performance,
        status: getStatus(
          categories.performance?.score != null ? categories.performance.score * 100 : null,
          THRESHOLDS.performance,
          false,
        ),
      },
      {
        name: 'LCP (Largest Contentful Paint)',
        value: audits['largest-contentful-paint']?.numericValue ?? null,
        unit: 'ms',
        threshold: THRESHOLDS.lcp,
        status: getStatus(audits['largest-contentful-paint']?.numericValue ?? null, THRESHOLDS.lcp),
      },
      {
        name: 'CLS (Cumulative Layout Shift)',
        value: audits['cumulative-layout-shift']?.numericValue ?? null,
        unit: 'score',
        threshold: THRESHOLDS.cls,
        status: getStatus(audits['cumulative-layout-shift']?.numericValue ?? null, THRESHOLDS.cls),
      },
      {
        name: 'FCP (First Contentful Paint)',
        value: audits['first-contentful-paint']?.numericValue ?? null,
        unit: 'ms',
        threshold: THRESHOLDS.fcp,
        status: getStatus(audits['first-contentful-paint']?.numericValue ?? null, THRESHOLDS.fcp),
      },
      {
        name: 'TTFB (Time to First Byte)',
        value: audits['server-response-time']?.numericValue ?? null,
        unit: 'ms',
        threshold: THRESHOLDS.ttfb,
        status: getStatus(audits['server-response-time']?.numericValue ?? null, THRESHOLDS.ttfb),
      },
      {
        name: 'TBT (Total Blocking Time)',
        value: audits['total-blocking-time']?.numericValue ?? null,
        unit: 'ms',
        threshold: 200,
        status: getStatus(audits['total-blocking-time']?.numericValue ?? null, 200),
      },
      {
        name: 'Speed Index',
        value: audits['speed-index']?.numericValue ?? null,
        unit: 'ms',
        threshold: 3400,
        status: getStatus(audits['speed-index']?.numericValue ?? null, 3400),
      },
    ]

    console.log('📊 性能测试结果\n')
    console.log('─'.repeat(70))

    for (const metric of metrics) {
      const icon = statusIcon(metric.status)
      const valueStr = formatValue(metric.value, metric.unit)
      const thresholdStr = metric.unit === 'score'
        ? `阈值: ${metric.threshold}`
        : `阈值: ${formatValue(metric.threshold, metric.unit)}`
      console.log(`${icon} ${metric.name.padEnd(40)} ${valueStr.padStart(10)}  (${thresholdStr})`)
    }

    console.log('─'.repeat(70))

    const goodCount = metrics.filter(m => m.status === 'good').length
    const totalCount = metrics.filter(m => m.status !== 'unknown').length
    console.log(`\n✨ 通过率：${goodCount}/${totalCount} 项达到 Good 标准\n`)

    // 输出优化建议
    const opportunities = Object.values(audits)
      .filter((audit: any) => audit.details?.type === 'opportunity' && audit.numericValue > 0)
      .sort((a: any, b: any) => b.numericValue - a.numericValue)
      .slice(0, 5)

    if (opportunities.length > 0) {
      console.log('💡 主要优化机会：')
      for (const opp of opportunities) {
        const saving = (opp as any).numericValue
        console.log(`   • ${(opp as any).title} (可节省约 ${Math.round(saving)}ms)`)
      }
      console.log()
    }
  }
  finally {
    await chrome.kill()
  }
}

runLighthouse(TARGET_URL).catch((err) => {
  console.error('性能测试失败:', err)
  process.exit(1)
})
