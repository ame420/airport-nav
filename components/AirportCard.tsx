import { Star, Zap, Globe, ExternalLink } from "lucide-react";

interface Airport {
  id: string;
  name: string;
  tags: string[];
  price: number;
  traffic: string;
  speed: string;
  score: number;
  support: string[];
  description: string;
  affiliateUrl: string;
  recommend: boolean;
}

export function AirportCard({ airport }: { airport: Airport }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{airport.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {airport.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {airport.recommend && (
          <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
            推荐
          </span>
        )}
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
    </div>
  );
}
