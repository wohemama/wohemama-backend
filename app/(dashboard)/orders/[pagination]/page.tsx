import { redirect } from "next/navigation";
import Pagination from "../../../../commponents/pagination";
import prisma from '../../../../utils/prismaClient'
import { getCurrentUser } from "../../../../utils/session";

export default async function Orders({
  params,
}: {
  params: { pagination: string };
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  const orders = await prisma.order.findMany({
    where: { seller: user!.email! },
    skip: 12 * (Number(params.pagination) - 1),
    take: 12,
  });
  const totalPagination = Math.ceil((await prisma.order.count({
    where: { seller: user!.email! },
  })) / 12);
  return (
    <>
      <div className="mt-4 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">订单</h1>
            <p className="mt-2 text-sm text-gray-700">订单列表</p>
          </div>

        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        姓名
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        电话
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        地址
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        支付方式
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        条目
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {orders.map((order, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? undefined : "bg-gray-50"}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {order.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {order.phone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {`${order.province} ${order.city} ${order.district} ${order.street}`}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {order.payMethod}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {order.payMethod}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            编辑<span className="sr-only">, {order.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPagination={Number(params.pagination)}
                  totalPagination={totalPagination}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
