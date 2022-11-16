import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Pagination({
  currentPagination,
  totalPagination,
}: {
  currentPagination: number;
  totalPagination: number;
}) {
  function activate(pagination: number): string {
    return pagination === currentPagination
      ? "border-indigo-500 text-indigo-600"
      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium";
  }
  return (
    <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
      <div className="-mt-px w-0 flex-1 flex">
        <Link
          href={`/orders/${currentPagination - 1}`}
          className={
            "border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }
        >
          <ArrowLongLeftIcon
            className="mr-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          上一页
        </Link>
      </div>
      <div className="hidden md:-mt-px md:flex">
        <Link href={"/orders/1"} className={activate(1)}>
          1
        </Link>
        <Link href={"/orders/2"} className={activate(2)}>
          2
        </Link>
        <Link href={"/orders/3"} className={activate(3)}>
          3
        </Link>

        <span className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
          ...
        </span>

        <Link
          href={`/orders/${totalPagination - 2}`}
          className={activate(totalPagination - 2)}
        >
          {totalPagination - 2}
        </Link>
        <Link
          href={`/orders/${totalPagination - 1}`}
          className={activate(totalPagination - 1)}
        >
          {totalPagination - 1}
        </Link>
        <Link
          href={`/orders/${totalPagination}`}
          className={activate(totalPagination)}
        >
          {totalPagination}
        </Link>
      </div>
      <div className="-mt-px w-0 flex-1 flex justify-end">
        <Link
          href={`/orders/${currentPagination + 1}`}
          className={
            "border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }
        >
          下一页
          <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Link>
      </div>
    </nav>
  );
}
