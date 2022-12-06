import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { checkNotifySign } from "../../../pay";

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
  if (checkNotifySign(req.query.body)) {
    const id = req.query.body["out_trade_no"];
    const order = await prisma.order.findUnique({ where: { outTradeNo: id } });
    if (
      req.query.body["trade_status"] === "TRADE_SUCCESS" &&
      req.query.body["total_amount"] * 100 === order.totalPrice * 100 &&
      !order.isNotified
    ) {
      await prisma.order.update({
        where: { outTradeNo: id },
        data: {
          tradeNo: ctx.request.body["trade_no"],
          isNotified: true,
          status: "paid",
        },
      });
      return "success";
    }
  }
}
