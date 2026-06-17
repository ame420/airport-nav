import { Star, Zap, Globe, ExternalLink, Heart } from "lucide-react";

export interface Airport {
  id: string;
  name: string;
  category: "低价" | "性价比";
  tags: string[];
  price: number;
  traffic: string;
  speed: string;
  score: number;
  support: string[];
  description: string;
  affiliateUrl: string;
  officialUrl: string;
  officialUrls?: string[];
  reviewUrl?: string;
  bandwidth?: string;
  recommend: boolean;
}

interface AirportCardProps {
  airport: Airport;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function AirportCard({
  airport,
  isFavorite = false,
  onToggleFavorite,
}: AirportCardProps) {
  const extraUrls = airport.officialUrls?.slice(1) ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">{airport.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                airport.category === "低价"
                  ? "bg-green-50 text-green-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {airport.category}
            </span>
            {airport.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {airport.recommend && (
            <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
              推荐
            </span>
          )}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(airport.id)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isFavorite ? "取消收藏" : "收藏"}
              title={isFavorite ? "取消收藏" : "收藏"}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 hover:text-red-400"
                }`}
              />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {airport.description}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500">月费</div>
          <div className="text-lg font-bold text-gray-900">¥{airport.price}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500">流量</div>
          <div className="text-sm font-bold text-gray-900">{airport.traffic}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500">速度</div>
          <div className="text-sm font-bold text-gray-900">{airport.speed}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500">评分</div>
          <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {airport.score}
          </div>
        </div>
      </div>

      {airport.bandwidth && (
        <div className="mb-4">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded">
            带宽: {airport.bandwidth}
          </span>
        </div>
      )}

      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <Globe className="w-3 h-3" />
          解锁支持
        </div>
        <div className="flex flex-wrap gap-2">
          {airport.support.map((item) => (
            <span
              key={item}
              className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <a
          href={airport.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          <Zap className="w-4 h-4" />
          前往注册
          <ExternalLink className="w-4 h-4" />
        </a>

        {extraUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {extraUrls.map((url, idx) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-blue-600 underline"
              >
                备用地址{idx + 1}
              </a>
            ))}
          </div>
        )}

        {airport.reviewUrl && (
          <a
            href={airport.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            查看详细测评 →
          </a>
        )}
      </div>
    </div>
  );
}
