const {S3Client,PutObjectCommand} =require('@aws-sdk/client-s3')
const{getSignedUrl}=require('@aws-sdk/s3-request-presigner')
const multerS3=require('multer-s3')
const multer=require('multer')
const videoModel = require('../models/Videos')


// 1. Configure the S3 Client
const s3=new S3Client(
    {
        region:'us-east-1',
        credentials:{
            accessKeyId:process.env.accessKeyId,
            secretAccessKey:process.env.secretAccessKey
        }
    }
)




// 2. Configure multer-s3 storage
const s3Storage = multerS3({
    s3: s3,
    bucket: 'bhuvistestvideosdatabucket',
    // acl: 'public-read', // Set appropriate access control
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        // Define the file name/key in S3 (e.g., use a timestamp to ensure uniqueness)
        cb(null, `uploads/${Date.now().toString()}-${file.originalname}`);
    },
});

// 3. Create the upload middleware instance
const upload = multer({
    storage: s3Storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size (e.g., 5MB)
    // Optional: Add file filters here if needed
});


const getUploadUrl = async (req, res) => {
  const { fileName, fileType } = req.query; // e.g. "video.mp4", "video/mp4"

  const key = `videos/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: 'bhuvistestvideosdatabucket',
    Key: key,
    ContentType: fileType,
    // ACL: "public-read" // only if you need public objects + allowed by bucket settings
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 900 }); // 15 minutes
  await videoModel.create({key})

  return res.json({
    uploadUrl: url,
    fileKey: key,
    fileUrl: `https://bhuvistestvideosdatabucket.s3.amazonaws.com/${key}`
  });
};

module.exports={s3,upload,getUploadUrl};