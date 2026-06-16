import { AlertTriangle } from "lucide-react";

export function Hero() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          低价机场导航站
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl">
          精选性价比高的机场服务，按价格、流量、速度分类整理，帮你快速找到合适的选择。
        </p>
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">风险提示</p>
            <p>
              任何机场都存在跑路风险，建议优先选择月付套餐。本站仅作信息整理，不对服务质量做任何担保。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
