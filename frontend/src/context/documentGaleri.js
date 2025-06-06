import { useState } from "react";

const ProductGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const changeImage = (index) => setCurrentIndex(index);

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Miniaturas */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
         <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:scale-110 transition"
        >
          

        </button>
        {images.map((img, index) => (

          <img
            key={index}
            src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
            alt={`Miniatura ${index}`}
            onClick={() => changeImage(index)}
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
              index === currentIndex ? "border-blue-800 border-4 " : "border-transparent"
            }`}
          />
        ))}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:scale-110 transition"
        >
          ‹

        </button>

        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:scale-110 transition"
        >
          ›
        </button>
      </div>

      {/* Imagen principal */}
      <div className="flex-1 flex justify-center items-center">
        <img
          src={`http://localhost:5000/${images[currentIndex].replace(/\\/g, "/")}`}
          alt="Imagen principal"
          className="max-h-[500px] w-full object-contain rounded-lg border"
        />
      </div>
    </div>
  );
};

export default ProductGallery;
