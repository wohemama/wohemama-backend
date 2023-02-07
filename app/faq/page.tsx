/* This example requires Tailwind CSS v2.0+ */
"use client"
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

import { classNames } from '../../utils'

const faqs = [
  {
    question: "怎么做到不用卖家上传商品信息，后台就能知道商品相关信息的？",
    answer:
      "我和妈妈的后台爬虫会在客户提交订单的时候实时的抓取网站的购物车里的商品信息，比如最重要的商品价格信息，防止客户篡改价格等",
  },
  {
    question: "我和妈妈平台购物车风格如何匹配我的网站的风格？",
    answer:
      "我和妈妈平台购物车设计偏向于中性，适合各种网站风格的设计，我们后期也会提供一下样式配置信息，比如几种风格供用户选择",
  },
  {
    question: "我没有网站和博客能用我和妈妈平台卖东西吗？",
    answer:
      "目前还不能，我们妈妈平台目前定位是购物车插件和解决支付相关问题，其实理论上您只要有能控制html代码的权力，您就可以使用这个插件，不排除我们后期会提供一键建站的功能",
  },
  {
    question: "使用你们的购物车插件需要认证什么信息吗？",
    answer:
      "不需要，只要你有个人的支付宝账户和微信账户就可以在线卖东西",
  },
  {
    question: "如果发生退货换货怎么处理，我和妈妈平台有相关支持服务吗？",
    answer:
      "我和妈妈平台只是购物车平台，这个只能是您和客户线下处理了，其实退换货大部分的工作在沟通，您有客户的联系方式，自行协商处理，我和妈妈不压客户资金，也不提供配送服务，既不偏袒卖方和也不偏袒买方",
  },
  {
    question: "代码都开源了，你们怎么赚钱",
    answer:
      "我和妈妈平台运行的就是您看到的同样的开源的代码，如何您有公司，申请支付接口，自己部署这套系统就不需要用我们部署的系统了，我们当然赚不到钱，其实我和妈妈平台更多的是那些没有公司，没法申请支付接口调用的那些用户",
  },
  {
    question: "怎么保证及时到账，真的能做到 T+0 交易吗",
    answer:
      "我们有一套可靠的系统保证客户支付的钱能马上到卖家的账户，这个系统的任务队列不会超过5分钟，当然这部分代码我们是不开源的，否则任何公司就能复制一个和我们公司一样的业务系统",
  },

]


export default function Faq() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          <dl className="mt-6 space-y-6 divide-y divide-gray-200">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <span className="ml-6 h-7 flex items-center">
                          <ChevronDownIcon
                            className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base text-gray-500">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
