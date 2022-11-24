import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { alipay, tenpay } from "../../../pay";
import Big from 'big.js';
import { uniqueId } from '../../../utils'

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

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  if (req.method === 'POST') {
    const outTradeNo = uniqueId();
    await prisma.order.create({
      data: { ...req.body, status: 'init', outTradeNo },
    });
    
    const parsedCart = JSON.parse(req.body.cartData ?? null) || [];
    const totalAmount = parsedCart
      .map(i => (new Big(i.itemPrice)).times(i.itemCount)).reduce((m, n) => (new Big(m)).plus(n), 0);
    const payMethod = req.body.payMethod;
    const isDesktop = /(Win32|Win16|WinCE|Mac68K|MacIntel|MacIntel|MacPPC|Linux mips64)/i.test(req.body.platform);
  
    let url, isQrcode, isH5;
  
    if (payMethod === "alipay") {
      if (isDesktop) {
        url = await alipay("alipay.trade.page.pay", outTradeNo, Number(totalAmount));
        isQrcode = true;
      } else {
        url = await alipay("alipay.trade.wap.pay", outTradeNo, Number(totalAmount));
      }
    } else {
      const amount = (new Big(totalAmount)).times(100)
      if (isDesktop) {
        url = await tenpay("NATIVE", outTradeNo,  Number(amount));
        isQrcode = true;
      } else {
        url = await tenpay("MWEB", outTradeNo, Number(amount));
        isH5 = true;
      }
    }
    res.status(200).json({ url, isQrcode, isH5, outTradeNo });
  }

  if (req.method === 'GET') {
    const order = await prisma.order.findFirst({where: { outTradeNo: req.query.outTradeNo }})
    res.status(200).json({status: order.status})
  }
}
