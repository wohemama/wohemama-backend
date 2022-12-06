import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { alipay, alipayOrderQuery, orderQuery, tenpay } from "../../../pay";
import Big from "big.js";
import { uniqueId } from "../../../utils";

const prisma = new PrismaClient();

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "POST", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: {
    (
      req: Cors.CorsRequest,
      res: {
        statusCode?: number | undefined;
        setHeader(key: string, value: string): any;
        end(): any;
      },
      next: (
        // Initializing the cors middleware
        err?: any
      ) => any
    ): void;
    (
      arg0: NextApiRequest,
      arg1: NextApiResponse<any>,
      arg2: (
        result: any // Helper method to wait for a middleware to execute before continuing
        // And to throw an error when an error happens in a middleware
      ) => void
    ): void;
  }
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const weixinStatusMap = {
  SUCCESS: "支付成功",
  REFUND: "转入退款",
  NOTPAY: "未支付",
  CLOSED: "已关闭",
  REVOKED: "已撤销",
  USERPAYING: "用户支付中",
  PAYERROR: "支付失败",
};
const alipayStatusMap = {
  WAIT_BUYER_PAY: "交易创建，等待买家付款",
  TRADE_CLOSED: "未付款交易超时关闭，或支付完成后全额退款",
  TRADE_SUCCESS: "支付成功",
  TRADE_FINISHED: "交易结束，不可退款",
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  if (req.method === "POST") {
    const parsedCart = JSON.parse(req.body.cartData ?? null) || [];
    const totalAmount = parsedCart
      .map((i) => new Big(i.itemPrice).times(i.itemCount))
      .reduce((m, n) => new Big(m).plus(n), 0);
    const payMethod = req.body.payMethod;
    const isDesktop =
      /(Win32|Win16|WinCE|Mac68K|MacIntel|MacIntel|MacPPC|Linux mips64)/i.test(
        req.body.platform
      );

    let url, isQrcode, isH5;
    const outTradeNo = uniqueId();
    await prisma.order.create({
      data: {
        ...req.body,
        status: "init",
        outTradeNo,
        totalPrice: Number(totalAmount),
      },
    });

    if (payMethod === "alipay") {
      if (isDesktop) {
        url = await alipay(
          "alipay.trade.page.pay",
          outTradeNo,
          Number(totalAmount)
        );
        isQrcode = true;
      } else {
        url = await alipay(
          "alipay.trade.wap.pay",
          outTradeNo,
          Number(totalAmount)
        );
      }
    } else {
      const amount = new Big(totalAmount).times(100);
      if (isDesktop) {
        url = await tenpay("NATIVE", outTradeNo, Number(amount));
        isQrcode = true;
      } else {
        url = await tenpay("MWEB", outTradeNo, Number(amount));
        isH5 = true;
      }
    }
    res.status(200).json({ url, isQrcode, isH5, outTradeNo });
  }

  if (req.method === "GET") {
    let status;
    const order = await prisma.order.findUnique({
      where: { outTradeNo: req.query.outTradeNo },
    });
    if (order?.status === "init") {
      res.status(200).json({ status: "init" });
      return;
    }
    if (order?.status === "paid") {
      res.status(200).json({ status: "支付成功" });
      return;
    }
    if (order?.payMethod === "tenpay") {
      const result = await orderQuery(order.outTradeNo);
      if (
        result.trade_state === "SUCCESS" &&
        result.total_fee == order.totalPrice * 100 &&
        !order.isNotified
      ) {
        await prisma.order.update({
          where: { outTradeNo: req.query.outTradeNo },
          data: {
            tradeNo: result.transaction_id,
            isNotified: true,
            status: "paid",
          },
        });
      }
      status = weixinStatusMap[result.trade_state];
    }
    if (order?.payMethod === "alipay") {
      const result = await alipayOrderQuery(order.outTradeNo);
      if (
        result.tradeStatus === "TRADE_SUCCESS" &&
        result["totalAmount"] * 100 === order.totalPrice * 100 &&
        !order.isNotified
      ) {
        await prisma.order.update({
          where: { outTradeNo: req.query.outTradeNo },
          data: {
            tradeNo: result.tradeNo,
            isNotified: true,
            status: "paid",
          },
        });
      }
      status = alipayStatusMap[result.tradeStatus];
    }

    return res.status(200).json({ status });
  }
}
