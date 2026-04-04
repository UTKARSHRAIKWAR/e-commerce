import asyncHandler from "express-async-handler"
import Products from "../db/product.model.js";
import logger from "../utils/logger.js";
export const addProduct = asyncHandler(async(req,res,next)=> {
        const {
            name,
            description, 
            price, 
            images, 
            discount,
            categoryId,
            stockQuantity
        } = req.body;
    
        const sellerId = req.headers["x-user-id"];

        logger.info(`Add product request by seller ${sellerId}`);
    
        if(!name || !description || !price || !stockQuantity){
            res.status(400).json({message:"All fields are required."});
        }
    
        const product = await Products.create({
            name,
            description,
            price,
            discount,
            categoryId,
            stockQuantity,
            images:req.file?.path,
            sellerId,
            isActive:true,
            ratingCount:0,
            averageRating:0,
        })

        logger.info(`Product created: ${product._id} by seller ${sellerId}`);

        if(!product){
            logger.error(`Failed to create product for seller ${sellerId}`);
            return res.status(500).json({message:"Failed to create product."})
        }

        res.status(201).json({message:"Product Created.",product:product});
})

export const getProduct = asyncHandler(async(req,res, next)=> {
        const {
            page=1,
            limit = 12,
            category,
            minPrice,
            maxPrice,
            search
        } = req.query;

        const filter = {isActive:true};

        if(category){
            filter.categoryId = category;
        }

        if(minPrice || maxPrice){
            filter.price = {};
            if(minPrice){
                filter.price.$gte = Number(minPrice);
            }
            if(maxPrice){
                filter.price.$lte = Number(maxPrice);
            }
        }

        if(search) {
            filter.name = {$regex:search, $options:"i"};
        }

        const products = await Products.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({createdAt: -1});

        const total = await Products.countDocuments(filter);

        logger.info(`Products fetched: ${products.length}`);

        res.status(200)
        .json({
            total,
            page:Number(page),
            pages:Math.ceil(total/limit),
            products,
        })

})

export const getProductById = asyncHandler(async(req,res)=> {
        const productId = req.params.id;

        logger.info(`Fetching product ${productId}`);

        const product = await Products.findById(productId);

        if(!product || !product.isActive){
            return res.status(404).json({message:"Product not found."})
        }

        res.status(200).json(product);
})


export const updateProduct = asyncHandler(async(req,res)=> {
        const sellerId = req.headers["x-user-id"];

        const product = await Products.findById(req.params.id);

        logger.info(`Update product request ${req.params.id} by seller ${sellerId}`);

        if(!product){
            return res.status(404).json({message:"Product not found."})
        }

        if(product.sellerId !== sellerId){
            logger.warn(`Unauthorized update attempt on product ${req.params.id}`);
            return res.status(403).json({message:"Unauthorize."})
        }

        Object.assign(product , req.body);

        await product.save();

        logger.info(`Product updated ${product._id}`);

        res.json(product);
})


export const deactivateProduct = asyncHandler(async( req,res) => {
    const sellerId = req.headers["x-user-id"];

    const product = await Products.findById(req.params.id);

    logger.info(`Deactivate product request ${req.params.id} by seller ${sellerId}`);

    if(!product){
        return res.status(404).json({message:"Product not found."})
    }

    if(product.sellerId !== sellerId){
        return res.status(403).json({message:"Unauthorized"})
    }

    product.isActive = false;
    await product.save();

    logger.info(`Product ${product._id} deactivated`);

    res.json({message:"Product deactivated."})
})


export const deleteProduct = asyncHandler(async (req,res)=>{
    const sellerId = req.headers["x-user-id"];

    logger.info(`Delete product request ${req.params.id} by seller ${sellerId}`);

    const product = await Products.findOneAndDelete({
        _id:req.params.id,
        sellerId
    });

    if(!product){
        return res.status(404).json({message:"Product not found or unauthorized"})
    }

    logger.info(`Product deleted ${product._id}`);

    res.json({message:"Product deleted.",product});
})


export const getSellerProducts = asyncHandler(async(req,res)=> {
    const sellerId = req.headers["x-user-id"];

    logger.info(`Fetching products for seller ${sellerId}`);

    const products = await Products.find({sellerId})
    .select("name price images stockQuantity createdAt")
    .sort({createdAt:-1});

    if (products.length === 0){
        logger.warn(`No products found for seller ${sellerId}`);
        return res.status(404).json({ message: "No products found for this seller" });
    }

    res.json(products)
})


export const validateStock = asyncHandler(async(req,res)=>{
    const {productId , quantity} = req.body;

    logger.info(`Stock validation request for product ${productId}`);

    if(!productId || !quantity){
        return res.status(400).json({
            message:"Product ID and quantity is required."
        })
    };

    const product = await Products.findById({_id:productId});

    

    if(!product || !product.isActive){
        logger.warn(`Stock validation failed: product ${productId} not found`);
        return res.status(400).json({
            message:"Product not found."
        })
    }

    if(product.stockQuantity < quantity){
        logger.warn(`Insufficient stock for product ${productId}`);
        res.status(400).json({
            message:"Insufficient stock",
            available:false,
            availableStock:product.stockQuantity
        });
    }

    logger.debug(`Stock validated for product ${productId}`);

    res.status(200).json({
        message:"Stock available",
        available:true,
        price:product.price,
        availableStock:product.stockQuantity
    });
})

export const deductStock = asyncHandler(async (req, res) => {
    const { items } = req.body;

    logger.info("Stock deduction request received");

    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Items are required." });
    }

    for (const item of items) {
        logger.debug(`Deducting stock for product ${item.productId}`);
        const updatedProduct = await Products.findOneAndUpdate(
            {
                _id: item.productId,
                stockQuantity: { $gte: item.quantity }
            },
            {
                $inc: { stockQuantity: -item.quantity }
            },
            { new: true }
        );

        if (!updatedProduct) {
            logger.error(`Stock deduction failed for product ${item.productId}`);
            return res.status(400).json({
                message: `Insufficient stock for product ${item.productId}`
            });
        }
    }

    logger.info("Stock deducted successfully for order");
    
    res.status(200).json({ message: "Stock deducted successfully" });
});


//TODO => add review controller.