import { AlertTriangle } from "lucide-react";
import { BookmarkButton } from "./BookmarkButton";

export function Hero() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              机场导航站
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
              精选低价与高性价比机场服务，按价格、流量、速度、线路类型分类整理，帮你快速找到合适的选择。
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <BookmarkButton />
            <a
              href="https://github.com/KaWaIDeSuNe/dijiajichang"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors min-h-[44px]"
              aria-label="访问 GitHub 数据源"
              title="GitHub: dijiajichang"
            >
              <img
                src="https://github.com/KaWaIDeSuNe.png"
                alt=""
                className="w-6 h-6 rounded-full"
                loading="lazy"
              />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>

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
