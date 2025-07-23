import { useRef, useState } from "react";

export default function ImagePicker({ image }) {
  const [previewImage, setPreviewImage] = useState(null);
  const fileInput = useRef(null);

  async function handleImageChange(event) {
    const file = event.target?.files[0];

    const fileReader = new FileReader();

    console.log(file.size);

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      const result = fileReader.result;
      setPreviewImage(result);
    };
  }

  return (
    <>
      <label htmlFor="profileImage">Avatar</label>
      <input
        ref={fileInput}
        id="profileImage"
        name="profileImage"
        type="file"
        accept="image/png image/jpeg image/webp"
        onChange={handleImageChange}
        hidden
      />
      <button
        type="button"
        className="size-40 rounded-full overflow-hidden border-3 border-header-outline"
        onClick={() => fileInput.current?.click()}
      >
        <img
          src={previewImage || image}
          alt="Picked Image"
          className="w-full h-full object-cover"
        />
      </button>
    </>
  );
}
