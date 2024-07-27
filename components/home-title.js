/**
 * Display the title of the site as a custom SVG.
 */
export default function HomeTitle() {
  return (
      <h1 className="relative">
      <span className="relative" style={{ fontSize: '60px', color: '#cd6fab' }}>Pancreas </span><span style={{ fontSize: '60px', color: '#85abd6' }}>Knowledgebase </span><span style={{ fontSize: '60px', color: '#cd6fab' }}>Program</span>
      <div className="absolute right-0 top-0 flex gap-1">
        <a
          href="https://hirnetwork.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-[#85abd6] px-3 py-0 text-sm text-white no-underline @lg/home:py-1"
        >
          HIRN
        </a>
        <a
          href="https://wiki.pankbase.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-brand px-3 py-0 text-sm text-white no-underline @lg/home:py-1"
        >
          PanKbase Wiki
        </a>
      </div>
    </h1>
  );
}
