import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { url } from "../App";

function ProfilePic({ handleChangePic }) {
  //its a reference that when you click on upload pic it triggers the input
  const hiddenFileInput = useRef(null);

  let [image, setImage] = useState("");
  let [imageUrl, setImageUrl] = useState("");

  let email = sessionStorage.getItem("email");
  let token = sessionStorage.getItem("token");

  //save profile pic
  const saveProfilePic = async () => {
    try {
      let res = await axios.put(
        `${url}/uploadProfilePic`,
        {
          email,
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);

        //to close the upload profile pic page
        handleChangePic();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  //cloudinary function
  const handlePost = async () => {
    try {
      //appending image data
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "vishnupriya");

      //post image to cloudinary create image link
      await fetch("https://api.cloudinary.com/v1_1/vishnupriya/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => setImageUrl(data.url))
        .catch((err) => console.log(err));
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  //to upload the profile pic
  const handleUploadPic = () => {
    hiddenFileInput.current.click();
  };

  //call handle post when image state updated
  useEffect(() => {
    if (image) {
      handlePost();
    }
  }, [image]);

  //call save Profile when url state updated
  useEffect(() => {
    if (imageUrl) {
      saveProfilePic();
    }
  }, [imageUrl]);

  return (
    <div className="profilePic darkBg ">
      <div className="changePic centered">
        <div>
          <h4>Change Profile pic</h4>
        </div>

        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={() => handleUploadPic()}
          >
            Upload Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={hiddenFileInput}
            style={{ display: "none" }}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#ED4956" }}
            onClick={() => {
              setImageUrl(null);
              saveProfilePic();
            }}
          >
            Remove Current Photo
          </button>
        </div>

        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={() => {
              handleChangePic();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePic;
