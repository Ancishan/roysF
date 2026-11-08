import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// DEBUG ENV CHECK

console.log("CLOUDINARY CONFIG CHECK:", {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,

  API_KEY: process.env.CLOUDINARY_API_KEY,

  API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    console.log("UPLOAD API CALLED");

    const formData = await req.formData();

    const file = formData.get("file") as File;

    console.log("FILE RECEIVED:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    });

    if (!file) {
      return NextResponse.json(
        {
          success: false,

          message: "No file received",
        },
        {
          status: 400,
        },
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            folder: "roys/products",
          },

          (error, result) => {
            console.log("CLOUDINARY CALLBACK:", {
              error,
              result,
            });

            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        )
        .end(buffer);
    });

    console.log("UPLOAD SUCCESS:", result.secure_url);

    return NextResponse.json({
      success: true,

      url: result.secure_url,
    });
  } catch (error: any) {
    console.log("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,

        message: error.message,
      },

      {
        status: 500,
      },
    );
  }
}
