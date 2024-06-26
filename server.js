const http = require("http");
const mongoose = require("mongoose");
const Post = require("./models/post");
const headers = require("./headers");
const dotenv = require("dotenv");
const handleSuccess = require("./handleSuccess");
const handleError = require("./handlerError");
const { checkPost } = require("./postHelper");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch(() => {
    console.log("資料庫連線失敗");
  });

const requestListener = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/posts" && req.method === "GET") {
    const allPost = await Post.find();
    handleSuccess(res, allPost);
  } else if (req.url === "/posts" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const post = JSON.parse(body);
        checkPost(post, res);
        await Post.create(post);
        handleSuccess(res, "新增成功");
        return;
      } catch (error) {
        handleError(res, "新增失敗");
      }
    });
  } else if (req.url.startsWith("/posts/") && req.method === "PATCH") {
    const id = req.url.split("/").pop();

    req.on("end", async () => {
      try {
        const data = await Post.findById(id);
        if (data !== null) {
          const post = JSON.parse(body);
          checkPost(post, res);
          await Post.findByIdAndUpdate(id, post);
          handleSuccess(res, "更新成功");
          return;
        } else {
          handleError(res, "找不到此筆資料,更新失敗");
        }
      } catch (error) {
        handleError(res, "更新失敗");
      }
    });
  } else if (req.url === "/posts" && req.method === "DELETE") {
    await Post.deleteMany();
    handleSuccess(res, "已刪除全部資料");
  } else if (req.url.startsWith("/posts/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    const data = await Post.findById(id);

    if (data !== null) {
      await Post.findByIdAndDelete(id);
      handleSuccess(res, `已刪除${data.name}`);
    } else {
      handleError(res, "找不到此筆資料,刪除失敗");
    }
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    handleError(res, "無此網站路由", 404);
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
