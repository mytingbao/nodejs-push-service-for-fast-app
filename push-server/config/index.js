const config = {
  server: {
    port: process.env.port || 3210
  },
  quickAppId: 3030000019,
  huawei: {
    appid: "1029**69",
    appSecret: "740b8286023798de14cd66a******3d89a7164f15",
    baseUrl: "https://push-api.cloud.huawei.com/v1"
  },
  oppo: {
    appKey: "76fc888***9b9514283247fb531",
    appSecret: "ef44b0253***3810f5f3462964def",
    MasterSecrect: "322d76***6274634b864a06",
    baseUrl: "https://api.push.oppomobile.com",
    mediaUrl: "https://api-media.push.heytapmobi.com"
  },
  xiaomi: {
    appid: "2882***691138",
    appKey: "593***20138",
    appSecret: "lPuiO6***2KcfVHw==",
    baseUrl: "https://api.xmpush.xiaomi.com"
  },
  vivo: {
    appid: 101961,
    appKey: "2be760***91198ff88b45",
    appSecret: "08d24***5b-76d7b2ce2cb6",
    baseUrl: "https://api-push.vivo.com.cn"
  }
};
module.exports = config;
