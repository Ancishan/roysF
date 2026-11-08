"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import api from "@/lib/axios";


export default function AddProduct() {

  const router = useRouter();


  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const [images, setImages] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);


  const [form, setForm] = useState<any>({

    name: "",
    slug: "",
    sku: "",

    categoryId: "",
    brandId: "",

    price: "",
    discountPrice: "",
    stock: "",
    lowStockAlert: "5",

    description: "",

    isActive: true,
    isFeatured: false,
    isNewArrival: false,

  });



  useEffect(() => {

    const loadData = async () => {

      try {

        const categoryRes =
          await api.get("/categories");


        const brandRes =
          await api.get("/brands");



        setCategories(
          categoryRes.data.data
        );


        setBrands(
          brandRes.data.data
        );


      } catch(error){

        console.log(error);

      }

    };


    loadData();


  }, []);





  const handleChange = (e:any)=>{

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };





  const uploadImage = async(e:any)=>{


    const file =
      e.target.files[0];


    if(!file) return;



    console.log(
      "SELECTED FILE:",
      file
    );



    try{


      setUploading(true);



      const formData =
        new FormData();


      formData.append(
        "file",
        file
      );



      const res =
        await fetch(
          "/api/upload",
          {
            method:"POST",
            body:formData
          }
        );



      console.log(
        "UPLOAD STATUS:",
        res.status
      );



      const data =
        await res.json();



      console.log(
        "UPLOAD RESPONSE:",
        data
      );



      if(data.success){


        setImages(prev=>[

          ...prev,

          data.url

        ]);


      }else{


        alert(
          data.message ||
          "Upload failed"
        );


      }



    }catch(error){


      console.log(
        "UPLOAD ERROR:",
        error
      );


      alert(
        "Image upload failed"
      );


    }
    finally{

      setUploading(false);

    }


  };





  const removeImage=(index:number)=>{


    setImages(

      images.filter(
        (_,i)=>i!==index
      )

    );


  };





  const submitProduct = async()=>{


    try{


      if(!form.categoryId){

        alert(
          "Please select category"
        );

        return;

      }



      setSaving(true);



      const payload={


        ...form,


        price:Number(
          form.price
        ),


        discountPrice:

          form.discountPrice

          ?

          Number(form.discountPrice)

          :

          undefined,



        stock:Number(
          form.stock
        ),



        lowStockAlert:Number(
          form.lowStockAlert
        ),



        images:

          images.map(
            (url,index)=>({

              url,

              isPrimary:
                index===0

            })

          )


      };



      console.log(
        "PRODUCT PAYLOAD:",
        payload
      );



      await api.post(
        "/products",
        payload
      );



      alert(
        "Product created successfully"
      );



      router.push(
        "/admin/products"
      );


      router.refresh();



    }catch(error:any){


      console.log(error);



      alert(

        error.response?.data?.message

        ||

        "Product create failed"

      );


    }
    finally{

      setSaving(false);

    }


  };
    return (

    <div className="
      space-y-6
    ">


      <h1 className="
        text-3xl
        font-bold
      ">
        Add Product
      </h1>




      <div className="
        bg-white
        border
        rounded-xl
        p-6
        space-y-6
      ">



        {/* Product Name */}

        <div>

          <label className="
            block
            mb-2
            font-medium
          ">
            Product Name
          </label>


          <input

            name="name"

            value={form.name}

            onChange={handleChange}

            placeholder="Enter product name"

            className="
              border
              w-full
              p-3
              rounded-lg
            "

          />

        </div>





        {/* SKU + SLUG */}


        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
        ">


          <div>

            <label className="
              block
              mb-2
              font-medium
            ">
              SKU
            </label>


            <input

              name="sku"

              value={form.sku}

              onChange={handleChange}

              placeholder="Product SKU"

              className="
                border
                w-full
                p-3
                rounded-lg
              "

            />


          </div>




          <div>

            <label className="
              block
              mb-2
              font-medium
            ">
              Slug
            </label>


            <input

              name="slug"

              value={form.slug}

              onChange={handleChange}

              placeholder="product-slug"

              className="
                border
                w-full
                p-3
                rounded-lg
              "

            />

          </div>


        </div>







        {/* CATEGORY + BRAND */}


        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
        ">


          <div>


            <label className="
              block
              mb-2
              font-medium
            ">
              Category
            </label>


            <select

              value={form.categoryId}

              onChange={(e)=>


                setForm({

                  ...form,

                  categoryId:e.target.value

                })


              }


              className="
                border
                w-full
                p-3
                rounded-lg
              "

            >


              <option value="">
                Select Category
              </option>



              {

                categories.map((item)=>(


                  <option

                    key={item.id}

                    value={item.id}

                  >

                    {item.name}

                  </option>


                ))

              }


            </select>


          </div>








          <div>


            <label className="
              block
              mb-2
              font-medium
            ">
              Brand
            </label>


            <select


              value={form.brandId}


              onChange={(e)=>

                setForm({

                  ...form,

                  brandId:e.target.value

                })

              }


              className="
                border
                w-full
                p-3
                rounded-lg
              "


            >


              <option value="">
                Select Brand
              </option>



              {


                brands.map((item)=>(


                  <option

                    key={item.id}

                    value={item.id}

                  >

                    {item.name}

                  </option>


                ))

              }


            </select>


          </div>



        </div>







        {/* PRICE */}


        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
        ">



          <div>


            <label className="
              block
              mb-2
              font-medium
            ">
              Price (৳)
            </label>


            <input

              name="price"

              value={form.price}

              onChange={handleChange}

              placeholder="Price"

              className="
                border
                w-full
                p-3
                rounded-lg
              "

            />


          </div>






          <div>


            <label className="
              block
              mb-2
              font-medium
            ">
              Discount Price (৳)
            </label>


            <input

              name="discountPrice"

              value={form.discountPrice}

              onChange={handleChange}

              placeholder="Discount Price"

              className="
                border
                w-full
                p-3
                rounded-lg
              "

            />


          </div>







          <div>


            <label className="
              block
              mb-2
              font-medium
            ">
              Stock Quantity
            </label>


            <input

              name="stock"

              value={form.stock}

              onChange={handleChange}

              placeholder="Stock"

              className="
                border
                w-full
                p-3
                rounded-lg
              "

            />


          </div>



        </div>









        {/* DESCRIPTION */}


        <div>


          <label className="
            block
            mb-2
            font-medium
          ">
            Description
          </label>


          <textarea

            name="description"

            value={form.description}

            onChange={handleChange}

            placeholder="Product description"

            className="
              border
              w-full
              p-3
              rounded-lg
              h-36
            "

          />


        </div>










        {/* IMAGE UPLOAD */}



        <div>


          <label className="
            block
            mb-2
            font-medium
          ">
            Product Images
          </label>



          <input

            type="file"

            accept="image/*"

            onChange={uploadImage}

          />



          {
            uploading && (

              <p className="
                text-sm
                mt-2
              ">
                Uploading image...
              </p>

            )
          }







          <div className="
            flex
            flex-wrap
            gap-4
            mt-4
          ">


            {

              images.map((img,index)=>(


                <div

                  key={index}

                  className="
                    relative
                    w-28
                    h-28
                  "

                >



                  <Image

                    src={img}

                    alt="product"

                    fill

                    className="
                      object-cover
                      rounded-lg
                      border
                    "

                  />




                  <button

                    type="button"

                    onClick={()=>
                      removeImage(index)
                    }


                    className="
                      absolute
                      top-1
                      right-1
                      bg-red-500
                      text-white
                      rounded-full
                      w-6
                      h-6
                    "

                  >

                    ×

                  </button>



                </div>



              ))

            }


          </div>



        </div>










        {/* STATUS */}



        <div className="
          flex
          flex-wrap
          gap-6
        ">



          <label className="
            flex
            gap-2
            items-center
          ">

            <input

              type="checkbox"

              checked={form.isActive}

              onChange={(e)=>

                setForm({

                  ...form,

                  isActive:e.target.checked

                })

              }

            />

            Active

          </label>







          <label className="
            flex
            gap-2
            items-center
          ">


            <input

              type="checkbox"

              checked={form.isFeatured}

              onChange={(e)=>

                setForm({

                  ...form,

                  isFeatured:e.target.checked

                })

              }

            />


            Featured


          </label>







          <label className="
            flex
            gap-2
            items-center
          ">


            <input

              type="checkbox"

              checked={form.isNewArrival}

              onChange={(e)=>

                setForm({

                  ...form,

                  isNewArrival:e.target.checked

                })

              }

            />


            New Arrival


          </label>



        </div>








        <button

          onClick={submitProduct}

          disabled={saving}


          className="
            bg-black
            text-white
            px-8
            py-3
            rounded-lg
          "

        >


          {
            saving
            ?
            "Creating..."
            :
            "Create Product"
          }


        </button>





      </div>


    </div>


  );

}