"use client";

import { useRef, useState } from "react";

export default function MultipleImagePicker() {
  const [pickedImages, setPickedImages] = useState([]);
  const fileInput = useRef(null);

  async function handleImageChange(event) {
    const files = event.target?.files;

    if (!files) {
      setPickedImages([]);
      return;
    }

    Array.from(files).map((file) => {
      const fileReader = new FileReader();

      console.log(file);

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        const result = fileReader.result;
        setPickedImages((prevPickedImages) => [...prevPickedImages, result]);
      };
    });
  }

  console.log(pickedImages);

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept="image"
        onChange={handleImageChange}
        multiple
        hidden
      />
      <button onClick={() => fileInput.current?.click()}>Choose</button>
      {pickedImages && (
        <ul>
          {pickedImages.map((pickedImage, index) => (
            <li key={index}>
              <img src={pickedImage} alt="Picked Image" width={100} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
