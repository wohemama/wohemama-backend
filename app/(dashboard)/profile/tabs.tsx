"use client";
import { useState } from "react";
import { classNames } from "../../../utils";
import axios from "axios";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const defaultTabs = [
  { name: "个人信息", href: "#", current: true },
  { name: "商店设置", href: "#", current: false },
];

export default function Tabs({
  user,
  website,
  host,
}: {
  user: { name: string; email: string; id: string };
  website: string;
  host: string;
}) {
  const [tabs, setTabs] = useState(defaultTabs);
  const [notice, setNotice] = useState("");
  return (
    <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
      {notice && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{notice}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setNotice('')
                  }}
                  className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-10 pb-16">
        <div className="px-4 sm:px-6 md:px-0">
          <h1 className="text-3xl font-extrabold text-gray-900">账户信息</h1>
        </div>
        <div className="px-4 sm:px-6 md:px-0">
          <div className="py-6">
            {/* Tabs */}
            <div className="lg:hidden">
              <label htmlFor="selected-tab" className="sr-only">
                Select a tab
              </label>
              <select
                id="selected-tab"
                name="selected-tab"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                defaultValue={tabs.find((tab) => tab.current)!.name}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden lg:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      className={classNames(
                        tab.current
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                      )}
                      onClick={() => {
                        setTabs(
                          tabs.map((t) => {
                            if (t.name === tab.name) t.current = true;
                            if (t.name !== tab.name) t.current = false;
                            return t;
                          })
                        );
                      }}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {tabs[0].current && (
              <div className=" divide-y divide-gray-200">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">昵称</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className="flex-grow">{user.name}</span>
                    </dd>
                  </div>

                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                    <dt className="text-sm font-medium text-gray-500">
                      电子邮箱
                    </dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className="flex-grow">{user.email}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
            {tabs[1].current && (
              <form
                className="space-y-8 divide-y divide-gray-200"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const formData = new FormData(form);
                  const formJson = Object.fromEntries(formData.entries());
                  axios
                    .post(`${host}/api/profile`, {
                      website: formJson.domain,
                      userId: user.id,
                    })
                    .then((res) => {
                      if (res.data.message === "sucess") {
                        setNotice("更新成功！");
                      }
                    })
                    .catch((err) => {
                      setNotice("更新出错！");
                    });
                }}
              >
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="domain"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      域名
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          w w w
                        </span>
                        <input
                          required
                          type="text"
                          name="domain"
                          id="domain"
                          defaultValue={website}
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
