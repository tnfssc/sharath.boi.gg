import { cn } from "~/lib/utils/index";

interface Props {
  caption: string;
  className?: string;
  imageUrl: string;
}

export default function ImageCard({ caption, className, imageUrl }: Props) {
  return (
    <figure
      className={cn(
        "w-[250px] overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow",
        className,
      )}
    >
      <img alt="image" className="aspect-4/3 w-full" src={imageUrl} />
      <figcaption className="border-t-2 border-border p-4 text-main-foreground">{caption}</figcaption>
    </figure>
  );
}
