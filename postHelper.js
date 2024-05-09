const handleError = require("./handlerError");

/**
 * 確認post貼文檢查規則
 * @param {object} postData 貼文資料
 * @param {object} res 回傳使用者的response
 * @returns 確認是否通過post貼文內容, 不通過則回傳error
 */
const checkPost = (postData, res) => {
  if (!postData.name) return handleError(res, "貼文名稱未填寫");
  if (!postData.content.trim()) return handleError(res, "貼文內容未填寫");
};

module.exports = { checkPost };
