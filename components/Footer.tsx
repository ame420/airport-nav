export function Footer() {
  return (
    <footer className="mt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-[11px] sm:text-xs text-gray-400">
            本站访客数{" "}
            <span id="busuanzi_value_site_uv" className="tabular-nums">
              …
            </span>{" "}
            人 · 本站总访问量{" "}
            <span id="busuanzi_value_site_pv" className="tabular-nums">
              …
            </span>{" "}
            次
          </p>
        </div>
      </div>
    </footer>
  );
}
