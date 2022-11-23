import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
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
      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium";
  }
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden"></div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="分页"
          >
            <Link
              href={`/orders/${
                currentPagination - 1 === 0 ? 1 : currentPagination - 1
              }`}
              className={
                "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              }
            >
              <span className="sr-only">上一页</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </Link>

            {totalPagination >= 1 && (
              <Link href={"/orders/1"} className={activate(1)}>
                1
              </Link>
            )}
            {totalPagination >= 2 && (
              <Link href={"/orders/2"} className={activate(2)}>
                2
              </Link>
            )}
            {totalPagination >= 3 && (
              <Link href={"/orders/3"} className={activate(3)}>
                3
              </Link>
            )}

            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              ...
            </span>
            {totalPagination >= 6 && (
              <Link
                href={`/orders/${totalPagination - 2}`}
                className={activate(totalPagination - 2)}
              >
                {totalPagination - 2}
              </Link>
            )}
            {totalPagination >= 5 && (
              <Link
                href={`/orders/${totalPagination - 1}`}
                className={activate(totalPagination - 1)}
              >
                {totalPagination - 1}
              </Link>
            )}
            {totalPagination >= 4 && (
              <Link
                href={`/orders/${totalPagination}`}
                className={activate(totalPagination)}
              >
                {totalPagination}
              </Link>
            )}

            <Link
              href={`/orders/${
                currentPagination + 1 > totalPagination
                  ? totalPagination
                  : currentPagination + 1
              }`}
              className={
                "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              }
            >
              <span className="sr-only">下一页</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
