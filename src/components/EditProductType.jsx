import supabase from "../services/supabase";
import { useState } from "react";

function EditProductType({ productType, getData}) {
    const [loading, setLoading] = useState(false);
    const [typesInfo, setTypesInfo] = useState({
        name: productType.name,
        description: productType.description,
        price: productType.price,
      });

      const inputHandle = (e) => {
        const { name, value } = e.target;
        setTypesInfo((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      
      const updateTypeDetailsByIdFromAllRows = async (e) => {
        e.preventDefault();
        setLoading(true);
        const typeIdToUpdate = productType.id
        try {
          // 1. Jadvaldagi barcha qatorlarni olish
          const { data: allData, error: fetchError } = await supabase
            .from("furniture") // jadval nomi
            .select("id, types"); // "id" va "types" ustunlari
      
          if (fetchError) {
            throw fetchError;
          }
      
          // 2. Har bir qatorni tekshirish va kerakli obyektni o'zgartirish
          for (const row of allData) {
            const { id, types } = row;
      
            // Agar types mavjud bo'lsa va ichida kerakli ID bo'lsa
            if (types && types.some((type) => type.id === typeIdToUpdate)) {
              // ID bo'yicha obyektni topish va o'zgartirish
              const updatedTypes = types.map((type) =>
                type.id === typeIdToUpdate
                  ? { ...type, name: typesInfo.name, description: typesInfo.description, price: typesInfo.price } // kerakli qismini o'zgartirish
                  : type
              );
      
              // 3. Yangilangan "types" ni saqlash
              const { error: updateError } = await supabase
                .from("furniture") // jadval nomi
                .update({ types: updatedTypes }) // yangilangan types
                .eq("id", id); // qatorning ID si
      
              if (updateError) {
                console.error(`Error updating row ${id}:`, updateError.message);
              } else {
                console.log(`Row ${id} updated successfully.`);
              }
            }
          }
      
          getData();
          document.getElementById(`editProductType_${productType.id}`).close();
          console.log("All rows checked and updated.");

        } catch (error) {
          console.error("Error:", error.message);
        }
        setLoading(false);
      };
      

  return (
    <>
        <button className="btn btn-sm" onClick={() => { document.getElementById(`editProductType_${productType.id}`).showModal(); }}>
            <i className={`bi bi-pencil`}></i>
        </button>

        <dialog id={`editProductType_${productType.id}`} className="modal">
        <div className="modal-box max-w-4xl">
          <>
            <form 
            onSubmit={updateTypeDetailsByIdFromAllRows}
            >
              <div className="flex justify-start items-center">
                {/* <div className="border-black border border-dotted w-[140px] h-[140px] flex-shrink-0 flex flex-col justify-center items-center">
                  <img
                    src={png.url}
                    alt=""
                    className={`${
                      png.url ? "" : "hidden"
                    } w-auto h-[90px] object-cover mb-1`}
                  />
                  <p className={`text-[12px] py-1 ${png.url ? "hidden" : ""}`}>
                    Select only PNG/JPG
                  </p>
                  <label
                    className={`text-[12px] btn btn-sm ${png.url ? "" : ""}`}
                    htmlFor="selectpng"
                  >
                    Select PNG/JPG
                  </label>
                  <input
                    className="hidden"
                    accept=".jpg, .jpeg, .png"
                    type="file"
                    id="selectpng"
                    onChange={handlePng}
                  />
                </div> */}
                <div className="flex flex-col w-full">
                  <label htmlFor="" className="flex flex-col">
                    <span>Названия:</span>
                    <input
                      name="name"
                      value={typesInfo.name}
                      onChange={inputHandle}
                      className="border px-2 py-1"
                      type="text"
                    />
                  </label>
                  <label htmlFor="" className="flex flex-col mt-2">
                    <span>Цена:</span>
                    <input
                      name="price"
                      value={typesInfo.price}
                      onChange={inputHandle}
                      className="border px-2 py-1"
                      type="text"
                    />
                  </label>
                </div>
              </div>
              <label htmlFor="" className="flex flex-col my-2">
                <span>Описание:</span>
                <textarea
                  rows="5"
                  name="description"
                  value={typesInfo.description}
                  onChange={inputHandle}
                  className="border px-2 py-1"
                  type="text"
                ></textarea>
              </label>

              <button className="btn btn-sm mt-3 w-full">
                <span className={`${loading ? "hidden" : ""}`}>Сохранить</span>
                <div className={`flex justify-center items-center gap-3 ${loading ? "" : "hidden"}`}>
                  <span className="loading loading-spinner loading-xs"></span> Сохранение...
                </div>
              </button>

            </form>
          </>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

    </>
  )
}

export default EditProductType