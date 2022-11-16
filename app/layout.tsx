import "./globals.css";
import { HomeIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import MobileMenuAndHeader from "../commponents/mobileMenuAndHeader";

const sidebarNavigation = [
  { name: "Home", href: "#", icon: HomeIcon, current: false },
  { name: "订单", href: "#", icon: BuildingStorefrontIcon, current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="h-full overflow-hidden">
        <div className="h-full flex">
          {/* Narrow sidebar */}
          <div className="hidden w-28 bg-indigo-700 overflow-y-auto md:block">
            <div className="w-full py-6 flex flex-col items-center">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                  alt="Workflow"
                />
              </div>
              <div className="flex-1 mt-6 w-full px-2 space-y-1">
                {sidebarNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-indigo-800 text-white"
                        : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                      "group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-white"
                          : "text-indigo-300 group-hover:text-white",
                        "h-6 w-6"
                      )}
                      aria-hidden="true"
                    />
                    <span className="mt-2">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <MobileMenuAndHeader>
            {/* Main content */}
            <div className="flex-1 flex items-stretch overflow-hidden">
              <main className="flex-1 overflow-y-auto">
                {/* Primary column */}
                <section
                  aria-labelledby="primary-heading"
                  className="min-w-0 flex-1 h-full flex flex-col lg:order-last"
                >
                  <h1 id="primary-heading" className="sr-only">
                    Photos
                  </h1>
                  {children}
                </section>
              </main>

              {/* Secondary column (hidden on smaller screens) */}
              <aside className="hidden w-96 bg-white border-l border-gray-200 overflow-y-auto lg:block">
                {/* Your content */}
              </aside>
            </div>
          </MobileMenuAndHeader>
        </div>
      </body>
    </html>
  );
}
