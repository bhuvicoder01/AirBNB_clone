const { unlink } = require('fs').promises;
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Maximum file size for Cloudinary free tier (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const cleanup = async (files, compressedFiles = []) => {
            if (!files) return;
            const allFiles = [...files, ...compressedFiles];
            await Promise.all(allFiles.map(file => {
                const filePath = file.path || file;
                return unlink(filePath).catch(err => 
                    console.error(`Failed to delete temp file ${filePath}:`, err)
                );
            }));
        };

const compressImage = async (file) => {
            const stats = await fs.stat(file.path);
            
            // If file is under size limit, return original path
            if (stats.size <= MAX_FILE_SIZE) {
                return file.path;
            }

            // Calculate compression quality based on file size
            const quality = Math.min(80, Math.floor((MAX_FILE_SIZE / stats.size) * 100));
            
            // Create compressed file path
            const ext = path.extname(file.path);
            const compressedPath = file.path.replace(ext, `_compressed${ext}`);
            
            // Compress image
            await sharp(file.path)
                .resize(1920, 1080, { 
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality, progressive: true })
                .toFile(compressedPath);

            return compressedPath;
        };
module.exports = { cleanup, compressImage };