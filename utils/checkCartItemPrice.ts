import * as cheerio from "cheerio";
import axios from "axios";

export default async function checkeCartItemPrice(parsedCart) {
  let ischeckout = true;
  const itemUrlList = parsedCart
    .map((i) => i.itemUrl)
    .reduce(
      (accumulator, currentValue) =>
        accumulator.includes(currentValue)
          ? accumulator
          : [...accumulator, currentValue],
      []
    );
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
