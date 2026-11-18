
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

export const runtime = "nodejs";

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Configure Cloudinary
cloudinary.v2.config(cloudinaryConfig);

export async function POST(req: Request) {
  try {
    console.log("UPLOAD API CALLED");

    // Check Cloudinary environment variables
    if (
      !cloudinaryConfig.cloud_name ||
      !cloudinaryConfig.api_key ||
      !cloudinaryConfig.api_secret
    ) {
      console.error("Cloudinary environment variables are missing");

      return NextResponse.json(
        {
          success: false,
          message: "Cloudinary configuration is incomplete",
        },
        { status: 500 }
      );
    }

    // Get uploaded file
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid image file received",
        },
        { status: 400 }
      );
    }

    console.log("FILE RECEIVED:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validate image type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image files are allowed",
        },
        { status: 400 }
      );
    }

    // Maximum file size: 5 MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be less than 5 MB",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload image to Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        {
          folder: "roys/products",
          resource_type: "image",
        },
        (error, uploadResult) => {
          if (error) {
            console.error("CLOUDINARY UPLOAD FAILED:", {
              message: error.message,
              http_code: error.http_code,
              name: error.name,
            });

            reject(error);
            return;
          }

          resolve(uploadResult);
        }
      ).end(buffer);
    });

    console.log("UPLOAD SUCCESS:", {
      public_id: result.public_id,
      format: result.format,
    });

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (error: any) {
    console.error("UPLOAD ERROR:", {
      message: error?.message,
      http_code: error?.http_code,
      name: error?.name,
    });

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Image upload failed",
      },
      { status: 500 }
    );
  }
}
