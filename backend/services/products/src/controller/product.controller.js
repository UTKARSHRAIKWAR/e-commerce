import asyncHandler from "express-async-handler"
import Products from "../db/product.model.js";
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

        if(!product){
            return res.status(500).json({message:"Failed to create product."})
        }

        res.status(201).json({message:"Product Created.",product:product});
})

export const getProduct = asyncHandler(async(req,res, next)=> {
        const {
            page=1,
            limit = 10,
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

        const product = await Products.findById(productId);

        if(!product || !product.isActive){
            return res.status(404).json({message:"Product not found."})
        }

        res.status(200).json(product);
})


export const updateProduct = asyncHandler(async(req,res)=> {
        const sellerId = req.headers["x-user-id"];

        const product = await Products.findById(req.params.id);

        if(!product){
            return res.status(404).json({message:"Product not found."})
        }

        if(product.sellerId !== sellerId){
            return res.status(403).json({message:"Unauthorize."})
        }

        Object.assign(product , req.body);

        await product.save();

        res.json(product);
})


export const deactivateProduct = asyncHandler(async( req,res) => {
    const sellerId = req.headers["x-user-id"];

    const product = await Products.findById(req.params.id);

    if(!product){
        return res.status(404).json({message:"Product not found."})
    }

    if(product.sellerId !== sellerId){
        return res.status(403).json({message:"Unauthorized"})
    }

    product.isActive = false;
    await product.save();

    res.json({message:"Product deactivated."})
})


export const deleteProduct = asyncHandler(async (req,res)=>{
    const sellerId = req.headers["x-user-id"];

    const product = await Products.findOneAndDelete({
        _id:req.params.id,
        sellerId
    });

    if(!product){
        return res.status(404).json({message:"Product not found or unauthorized"})
    }

    res.json({message:"Product deleted.",product});
})


export const getSellerProducts = asyncHandler(async(req,res)=> {
    const sellerId = req.headers["x-user-id"];

    const products = await Products.find({sellerId})
    .select("name price images stockQuantity createdAt")
    .sort({createdAt:-1});

    if (products.length === 0){
        return res.status(404).json({ message: "No products found for this seller" });
    }

    res.json(products)
})


export const validateStock = asyncHandler(async(req,res)=>{
    const {productId , quantity} = req.body;

    if(!productId || !quantity){
        return res.status(400).json({
            message:"Product ID and quantity is required."
        })
    };

    const product = await Products.findById({_id:productId});

    console.log(product);
    

    if(!product || !product.isActive){
        return res.status(400).json({
            message:"Product not found."
        })
    }

    if(product.stockQuantity < quantity){
        res.status(400).json({
            message:"Insufficient stock",
            available:false,
            availableStock:product.stockQuantity
        });
    }

    res.status(200).json({
        message:"Stock available",
        available:true,
        availableStock:product.stockQuantity
    });
})

//TODO => add review controller.