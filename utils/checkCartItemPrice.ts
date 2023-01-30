import * as cheerio from "cheerio";
import axios from "axios";
import client from "./prismaClient";
import { parseDomain } from "parse-domain";

export default async function checkeCartItemPrice(parsedCart, seller) {
  let ischeckout = true;
  const user = await client.user.findUnique({
    where: {
      email: seller,
    },
  });
  if (!user) return false;
  const profile = await client.profile.findUnique({
    where: { userId: user!.id },
  });
  if (!profile) return false;
  const domain = profile?.website;
  if (!domain) return false;

  const itemUrlList = parsedCart
    .map((i) => i.itemUrl)
    .reduce(
      (accumulator, currentValue) =>
        accumulator.includes(currentValue)
          ? accumulator
          : [...accumulator, currentValue],
      []
    );
  if (
    itemUrlList.some((url) => {
      const parseResult = parseDomain(new URL(url).host);
      return parseResult.domain + "." + parseResult.topLevelDomains !== domain;
    })
  )
    return false;
  const promiseList = itemUrlList.map(async (i) => {
    return axios.get(i);
  });

  await Promise.all(promiseList)
    .then((list) => {
      const urlAndhtmlList = itemUrlList.map((url, index) => {
        return {
          url: url,
          html: list.map((i) => i.data)[index],
        };
      });

      ischeckout = !urlAndhtmlList.some((i) => {
        const $ = cheerio.load(i.html);
        return parsedCart.some((p) => {
          if (p.itemUrl === i.url) {
            const scrapedPrice = $(`button[data-item-id=${p.itemId}]`).attr()![
              "data-item-price"
            ];
            return p.itemPrice !== scrapedPrice;
          }
        });
      });
    })
    .catch(() => {
      ischeckout = false;
    });
  return ischeckout;
}
