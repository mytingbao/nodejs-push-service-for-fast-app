const config = {
  server: {
    port: process.env.port || 3210
  },
  quickAppId: 30365619,
  huawei: {
    appid: "102961169",
    appSecret: "740b8286023798de14cd66abc33d26cb241b607787cde65d40a73d89a7164f15",
    baseUrl: "https://push-api.cloud.huawei.com/v1"
  },
  oppo: {
    appKey: "76fc69c31e904849b9514283247fb531",
    appSecret: "ef44b0253ad84053810f5f3462964def",
    MasterSecrect: "322d76ebb59747eaa86274634b864a06",
    baseUrl: "https://api.push.oppomobile.com",
    mediaUrl: "https://api-media.push.heytapmobi.com"
  },
  xiaomi: {
    appid: "2882303761518691138",
    appKey: "5931869120138",
    appSecret: "lPuiO6nWO7NB3v02KcfVHw==",
    baseUrl: "https://api.xmpush.xiaomi.com"
  },
  vivo: {
    appid: 100011961,
    appKey: "2be7607a6e51ad598fe191198ff88b45",
    appSecret: "08d248f0-7fd3-485d-8f5b-76d7b2ce2cb6",
    baseUrl: "https://api-push.vivo.com.cn"
  }
};
module.exports = config;
