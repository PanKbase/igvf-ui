/**
 * Display the title of the site as a custom SVG.
 */
export default function HomeTitle() {
  return (
      <h1 className="relative">
      <span className="relative" style={{ fontSize: '55px', color: '#219197' }}>PanKbase </span><span style={{ fontSize: '45px', color: '#94c95e' }}>Data </span><span style={{ fontSize: '45px', color: '#219197' }}>Library</span>
      <div className="absolute right-0 top-0 flex gap-1">
        <a
          href="https://hirnetwork.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-brand px-3 py-0 text-xs text-white no-underline @lg/home:py-1"
        >
          HIRN
        </a>
        <a
          href="https://pankbase.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-brand px-3 py-0 text-xs text-white no-underline @lg/home:py-1"
        >
          PanKbase
        </a>
        <a
          href="https://pankgraph.pankbase.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-brand px-3 py-0 text-xs text-white no-underline @lg/home:py-1"
        >
          PanKgraph
        </a>
      </div>
    </h1>
  );
}
