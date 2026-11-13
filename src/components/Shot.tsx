// A screenshot in a light window frame. The bar says what the picture shows.
export default function Shot({
  src,
  alt,
  caption,
  eager = false,
  className = '',
}: {
  src: string;
  alt: string;
  caption: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <figure className={`min-w-0 overflow-hidden rounded-[10px] border border-line bg-surface ${className}`}>
      <figcaption className="flex items-center gap-2 border-b border-line bg-tint px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#F0A49B]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F3CF7A]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#9AD9A7]" />
        </span>
        <span className="ml-1 min-w-0 truncate text-[0.78rem] text-muted">{caption}</span>
      </figcaption>
      <img
        src={src}
        alt={alt}
        width={1200}
        height={750}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block aspect-[16/10] w-full object-cover object-top"
      />
    </figure>
  );
}
