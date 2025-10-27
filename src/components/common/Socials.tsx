import Link from "next/link";

/**
 * A text link to the artists instagram
 * @param param0 input object
 * @param param0.text the text to display as the link
 * @param param0.target target override option
 * @returns react node
 */
export function InstagramTextLink({
  text,
  target,
}: {
  text: string;
  target?: string;
}) {
  return (
    <Link
      target={`${target ?? "_blank"}`}
      href={"https://instagram.com/bebsisbadekar"}
      className="text-blue-500 underline"
    >
      {text}
    </Link>
  );
}
