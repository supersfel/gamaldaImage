import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors"; // cors 패키지를 가져옵니다.
import "dotenv/config";
import fs from "fs"; // 파일 시스템 모듈 추가
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT;
const url = process.env.URL;

let corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors({ allowedHeaders: ["Authorization", "Content-Type"] }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  // 업로드된 이미지의 URL 생성
  const imageUrl = `${url}:${port}/images/${req.file.filename}`;

  // 이미지 URL과 함께 응답 전송
  res.json({ state: "success", message: "success", imageUrl: imageUrl });
});

// 이미지 삭제 엔드포인트 추가
app.delete("/delete/:filename", (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, "images", filename);

  // 파일 존재 여부를 확인하고 삭제
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({ state: "error", message: "이미지가 없습니다" });
    } else {
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) {
          res
            .status(500)
            .json({ state: "error", message: "이미지 삭제 중 오류 발생" });
        } else {
          res.json({ state: "success", message: "성공" });
        }
      });
    }
  });
});

app.use("/images", express.static("images"));

app.listen(port, () => {
  console.log(`서버가 ${url}:${port} 에서 실행 중입니다.`);
});
