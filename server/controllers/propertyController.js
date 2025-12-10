const propertyModel = require("../models/Property");
const cloudinary = require('../services/cloudinary');
const { cleanup, compressImage } = require('../utils/imageProcessors');



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

    static addReview = async (req, res) => {
        const id=req.params.id
        res.json({id,message:"yet to implement the logic"})
    }


    static create = async (req, res) => {
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
            const hostId = req.query.hostId;
            // console.log(hostId)
            const properties = await propertyModel.find({ hostId:hostId }).sort({ createdAt: -1 });
            return res.json(properties);
        } catch (error) {
            console.error(error)
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
            console.error(error)
            return res.status(500).json({ message: 'Failed to update property',error:error });
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