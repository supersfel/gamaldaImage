import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors"; // cors 패키지를 가져옵니다.
import "dotenv/config";

const app = express();
const port = process.env.PORT;
const url = process.env.URL;

app.use(cors());

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
  res.json({ message: "이미지 업로드 완료", imageUrl: imageUrl });
});

app.use("/images", express.static("images"));

app.listen(port, () => {
  console.log(`서버가 ${url}:${port} 에서 실행 중입니다.`);
});
