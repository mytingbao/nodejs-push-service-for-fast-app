const path = require("path");
const fs = require("fs");
const multer = require("multer");
interface UploadResponse {
  filename: string;
  payload: any;
}

export const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../static"));
    },
    filename: (req, file, cb) => {
      cb(null, new Date().getTime() + "-" + file.originalname);
    }
  }),
  limits: {
    fileSize: 1000 * 1024,
    files: 1
  }
});

/**
 * upoload single file and return the filename
 *
 * @param {Request} req Requst to be sent.(express expose)
 * @param {Response} res Response .(express expose)
 * @param {String} field Just the key of the formdata file
 * @return {Promise<Sting>} A promise that resolves with the response filename.
 */

export async function uploadSingleFile(
  req,
  res,
  field = "file"
): Promise<UploadResponse> {
  return new Promise(resolve => {
    const interceptor = uploader.single(field);
    interceptor(req, res, err => {
      if (err) {
        const reflectList = {
          LIMIT_FILE_SIZE: 413
        };
        if (reflectList.hasOwnProperty(err.code)) {
          return res.sendStatus(reflectList[err.code]);
        }
        res.send({ code: 500, data: err.message, message: "上传失败" });
      } else {
        fs.exists(req.file.path, exists => {
          if (!exists) {
            res.send({ code: 500, data: "", message: "上传失败" });
          } else {
            resolve({ filename: req.file.path, payload: req.body });
          }
        });
      }
    });
  });
}

/**
 * Parsing text content
 * @param {String} filename filename
 * @return {String} text content
 */

export function parseTxtContent(filename: string): Promise<string> {
  return new Promise(reslove => {
    const rs = fs.createReadStream(filename);
    rs.setEncoding("utf-8");
    let data = "";
    rs.on("data", trunk => {
      data += trunk;
    });
    rs.on("end", () => {
      reslove(data);
    });
  });
}

export function deleteFile(filename: string) {
  fs.unlink(filename, err => {
    if (!err) {
      console.log(`移除${filename}成功`);
    }
  });
}
