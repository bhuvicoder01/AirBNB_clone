const propertyModel = require("../models/Property");
const cloudinary = require('../services/cloudinary');
const { unlink } = require('fs').promises;
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Maximum file size for Cloudinary free tier (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

class propertyController {
    // General property endpoints
    static getAll = async (req, res) => {
        try {
            const filters = {};
            
            // Apply filters if provided
            if (req.query.location) {
                filters['location.city'] = new RegExp(req.query.location, 'i');
            }
            if (req.query.priceMin) {
                filters.price_per_night = { $gte: Number(req.query.priceMin) };
            }
            if (req.query.priceMax) {
                filters.price_per_night = { ...filters.price_per_night, $lte: Number(req.query.priceMax) };
            }
            if (req.query.guests) {
                filters.max_guests = { $gte: Number(req.query.guests) };
            }

            const properties = await propertyModel.find(filters).sort({ createdAt: -1 });
            return res.json(properties);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch properties' });
        }
    }

    static getById = async (req, res) => {
        try {
            const id = req.params.id;
            const property = await propertyModel.findById(id);
            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }
            return res.json(property);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch property' });
        }
    }

    static create = async (req, res) => {
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

        let compressedFiles = [];

        try {
            // First, create the property without images
            const propertyData = JSON.parse(req.body.data);
            const files = req.files;

            // Create property first to minimize response time
            const propertyToCreate = {
                ...propertyData,
                images: [], // Will be updated after upload
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                rating: {
                    overall: 0,
                    cleanliness: 0,
                    accuracy: 0,
                    communication: 0,
                    location: 0,
                    value: 0
                },
                reviews_count: 0
            };

            const property = await propertyModel.create(propertyToCreate);

            // Send initial response
            res.json({
                property: property,
                message: "Property created successfully. Images are being processed..."
            });

            // Upload images in background
            if (files && files.length > 0) {
                // Compress images if needed
                const processedPaths = await Promise.all(
                    files.map(async file => {
                        const compressedPath = await compressImage(file);
                        if (compressedPath !== file.path) {
                            compressedFiles.push(compressedPath);
                        }
                        return compressedPath;
                    })
                );

                // Upload processed images
                const uploadPromises = processedPaths.map(filePath => 
                    cloudinary.uploader.upload(filePath, {
                        folder: 'airbnb_clone/properties',
                        transformation: [
                            { width: 800, crop: 'scale' },
                            { quality: 'auto:eco' }
                        ],
                        resource_type: 'auto'
                    })
                );

                // Process images in batches of 3
                const imageUrls = [];
                for (let i = 0; i < uploadPromises.length; i += 3) {
                    const batch = uploadPromises.slice(i, i + 3);
                    const results = await Promise.all(batch);
                    imageUrls.push(...results.map(result => result.secure_url));
                }

                // Update property with image URLs
                await propertyModel.findByIdAndUpdate(property._id, {
                    images: imageUrls
                });
            }

            // Clean up all files after successful upload
            await cleanup(files, compressedFiles);

        } catch (error) {
            console.error('Property creation error:', error);
            // If response hasn't been sent yet
            if (!res.headersSent) {
                return res.status(500).json({ 
                    error: 'Failed to create property: ' + error.message 
                });
            }
            // Clean up all files in case of error
            await cleanup(req.files, compressedFiles);
        }
    }

    // Host-specific endpoints
    static getHostProperties = async (req, res) => {
        try {
            const hostId = req.params.hostId || req.user.id;
            const properties = await propertyModel.find({ hostId }).sort({ createdAt: -1 });
            return res.json(properties);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch host properties' });
        }
    }

    static updateProperty = async (req, res) => {
        try {
            const propertyId = req.params.id;
            const updates = {
                ...req.body,
                updatedAt: new Date()
            };

            const property = await propertyModel.findOne({ _id: propertyId});
            if (!property) {
                return res.status(404).json({ error: 'Property not found or unauthorized' });
            }

            const updatedProperty = await propertyModel.findByIdAndUpdate(
                propertyId,
                updates,
                { new: true }
            );

            return res.json({
                property: updatedProperty,
                message: "Property updated successfully"
            });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update property' });
        }
    }

    static togglePropertyStatus = async (req, res) => {
        try {
            const propertyId = req.params.id;
            const property = await propertyModel.findOne({ _id: propertyId});
            
            if (!property) {
                return res.status(404).json({ error: 'Property not found ' });
            }

            const updatedProperty = await propertyModel.findByIdAndUpdate(
                propertyId,
                { 
                    isActive: !property.isActive,
                    updatedAt: new Date()
                },
                { new: true }
            );

            return res.json({
                property: updatedProperty,
                message: `Property ${updatedProperty.isActive ? 'activated' : 'deactivated'} successfully`
            });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to toggle property status' });
        }
    }

    static deleteProperty = async (req, res) => {
        try {
            const propertyId = req.params.id;
            const property = await propertyModel.findOne({ _id: propertyId, hostId: req.user.id });
            
            if (!property) {
                return res.status(404).json({ error: 'Property not found or unauthorized' });
            }

            await propertyModel.findByIdAndDelete(propertyId);
            return res.json({ message: 'Property deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete property' });
        }
    }

    // Search and filter endpoints
    static searchProperties = async (req, res) => {
        try {
            const {
                location,
                checkIn,
                checkOut,
                guests,
                priceMin,
                priceMax,
                amenities
            } = req.query;

            const filters = { isActive: true };

            if (location) {
                filters['location.city'] = new RegExp(location, 'i');
            }
            if (priceMin || priceMax) {
                filters.price_per_night = {};
                if (priceMin) filters.price_per_night.$gte = Number(priceMin);
                if (priceMax) filters.price_per_night.$lte = Number(priceMax);
            }
            if (guests) {
                filters.max_guests = { $gte: Number(guests) };
            }
            if (amenities) {
                const amenitiesList = amenities.split(',');
                filters.amenities = { $all: amenitiesList };
            }

            // Check availability if dates provided
            if (checkIn && checkOut) {
                filters.availableDates = {
                    $elemMatch: {
                        startDate: { $lte: new Date(checkOut) },
                        endDate: { $gte: new Date(checkIn) }
                    }
                };
            }

            const properties = await propertyModel.find(filters).sort({ createdAt: -1 });
            return res.json(properties);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to search properties' });
        }
    }
}

module.exports=propertyController