import fs from "fs";
import path from "path";
import cron from "node-cron";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

// 毎朝6時と16時に実行
cron.schedule("0 9,16 * * *", () => {
  // SMTPトランスポートを使用して再利用可能なトランスポーターオブジェクトを作成します
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.PASSWORD,
    },
  });

  // テキストファイルが保存されているディレクトリの内容を読み取ります
  let files = fs.readdirSync("./articles");

  // リストからランダムなファイルを選択します
  let randomFile = files[Math.floor(Math.random() * files.length)];

  // メールオプションを作成します
  let mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: process.env.MAIL_ADDRESS,
    subject: "今日の小話",
    html: fs.readFileSync(path.join("./articles", randomFile), "utf-8"),
  };

  // 定義されたトランスポートオブジェクトでメールを送信します
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("メッセージが送信されました：%s", info.messageId);
    }
  });
});
