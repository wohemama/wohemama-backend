import client from "../../../utils/prismaClient";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";



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
  if (req.method === "POST") {
    const website = req.body["website"];
    const userId = req.body['userId']
    console.log(website, userId)
    const profile = await client.profile.findUnique({ where: { userId } });
    if (profile) {
      await client.profile.update({
          where: { userId },
          data: {
            website
          },
        });
    } else {
      await client.profile.create({
          data: {
              website,
              userId
          }
      })
    }
    return res.status(200).json({message: 'sucess'})
  }
}
