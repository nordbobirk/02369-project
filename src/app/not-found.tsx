import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center my-8 pt-24">
      <div className="flex flex-col">
        <h1 className="text-4xl text-center">Side ikke fundet</h1>
        <h3 className="text-center">
          Vi kunne ikke finde den side, du leder efter
        </h3>
        <Link
          className="text-center underline text-blue-500 cursor-pointer"
          href={"/"}
        >
          Tilbage til forsiden
        </Link>
      </div>
    </div>
  );
}
