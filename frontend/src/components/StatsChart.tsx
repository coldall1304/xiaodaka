'use client'

interface StatsChartProps {
  data: {
    date: string
    completed: number
    total: number
  }[]
}

export default function StatsChart({ data }: StatsChartProps) {
  const maxTotal = Math.max(...data.map((d) => d.total), 1)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-4">📊 近7天完成情况</h3>

      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item.completed / item.total) * 100
          const height = (item.total / maxTotal) * 100

          return (
            <div key={index} className="flex items-center gap-3">
              {/* 日期 */}
              <div className="w-16 text-sm text-gray-500">{item.date}</div>

              {/* 进度条 */}
              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                {/* 总任务高度 */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gray-200 rounded-lg"
                  style={{ height: `${height}%` }}
                />

                {/* 完成高度 */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-lg transition-all duration-300"
                  style={{ height: `${(item.completed / maxTotal) * 100}%` }}
                />

                {/* 数量 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {item.completed}/{item.total}
                  </span>
                </div>
              </div>

              {/* 百分比 */}
              <div className="w-12 text-right text-sm font-medium text-gray-600">
                {percentage.toFixed(0)}%
              </div>
            </div>
          )
        })}
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-200 rounded" />
          <span>总任务</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary-500 rounded" />
          <span>已完成</span>
        </div>
      </div>
    </div>
  )
}