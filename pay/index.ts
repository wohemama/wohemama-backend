import fs from "fs";
import AlipaySdk from "alipay-sdk";
import AlipayFormData from "alipay-sdk/lib/form";
import Tenpay from "tenpay";

// const tenpay = require('tenpay');
const config = {
  appid: "wx8ba7e68c2687f535",
  mchid: "1438649902",
  partnerKey: "c6f5a4ed9254666e327f14c5bfe88c98",
  pfx: require("fs").readFileSync("pay/key/tenpay/apiclient_key.pem", "ascii"),
  notify_url: "支付回调网址",
  spbill_create_ip: "45.79.113.243",
};

// 调试模式(传入第二个参数为true, 可在控制台输出数据)
const api = new Tenpay(config);

const alipaySdk = new AlipaySdk({
  appId: "2019100267989407",
  privateKey: fs.readFileSync("pay/key/alipay/app_private_key.pem", "ascii"),
  alipayPublicKey: fs.readFileSync(
    "pay/key/alipay/alipay_public_key.pem",
    "ascii"
  ),
});

export const orderQuery = async (outTradeNo: {out_trade_no: string}) => {
  const result = await api.orderQuery(outTradeNo);
  return result;
}

export const alipayOrderQuery = async (outTradeNo) => {
  const result = await alipaySdk.exec('alipay.trade.query',{
    bizContent: {
      out_trade_no: outTradeNo
    }
  });
  return result;
}

export const checkNotifySign = (postData) => {
  return alipaySdk.checkNotifySign(postData);
}


export const alipay = async (biz, outTradeNo, totalAmount) => {
  const formData = new AlipayFormData();
  // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  formData.setMethod("get");

  formData.addField("notifyUrl", process.env.NOTIFY_URL);
  formData.addField("returnUrl", process.env.RETURN_URL);
  formData.addField("bizContent", {
    qr_pay_mode: 4,
    qrcode_width: 150,
    outTradeNo,
    productCode: "FAST_INSTANT_TRADE_PAY",
    totalAmount,
    subject: "小贴画网站订单",
    body: "给自己一张贴纸，激励自己，表达自己的爱",
  });

  const url = await alipaySdk.exec(biz, {}, { formData });
  return url;
};
export const tenpay = async (tradeType, outTradeNo, totalFee) => {
  const result = await api.unifiedOrder({
    out_trade_no: outTradeNo,
    body: "小贴画网站订单",
    total_fee: totalFee,
    trade_type: tradeType,
  });
  if (tradeType === "MWEB") {
    return result["mweb_url"];
  }
  return result["code_url"];
};
