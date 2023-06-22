import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { url } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  let [image, setImage] = useState([]);
  let [text, setText] = useState();
  let [imageUrl, setImageUrl] = useState("");
  let [user, setUser] = useState([]);

  let navigate = useNavigate();

  let email = sessionStorage.getItem("email");
  let token = sessionStorage.getItem("token");

  let previewImage =
    "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png";

  let picLink =
    "https://img.freepik.com/premium-vector/avatar-profile-icon_188544-4755.jpg";

  //to get profile of that particular user who has logged in
  const getUserDetails = async () => {
    try {
      let res = await axios.get(`${url}/profile-details/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  //to pre-populate the user details who has logged in
  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    try {
      if (imageUrl) {
        let res = axios.post(
          `${url}/users/createPost`,
          {
            text: text,
            image: imageUrl,
            name: user.fullName,
            email: email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Posted successfully");
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  }, [imageUrl]);

  //cloudinary function
  const handlePost = async () => {
    try {
      //appending image data
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "vishnupriya");

      //post image to cloudinary to create an image link
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

  //preview image of uploaded file
  const loadFile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  return (
    <>
      <div>
        <div className="d-flex justify-content-center">
          <div className="create-post">
            <div className="post-header d-flex justify-content-around pt-2">
              <h4>Create New Post</h4>
              <Button
                variant="primary"
                style={{ width: "5em", height: "2.5em" }}
                onClick={() => handlePost()}
              >
                Share
              </Button>
            </div>
            <div className="post-body p-1" enctype="multipart/form-data">
              <img
                id="output"
                src={previewImage}
                alt=""
                style={{ width: "100%", height: "22em" }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  loadFile(event);
                  setImage(event.target.files[0]);
                }}
                className="pt-1"
              />
            </div>
            <div className="card-details">
              <div className="card-header">
                <div className="card-pic">
                  <img
                    src={user.photo ? user.photo : picLink}
                    alt=""
                    width="40"
                    height="40"
                    class="rounded-circle"
                  />
                </div>
                <h6>
                  <b>{user.fullName}</b>
                </h6>
              </div>
              <div>
                <textarea
                  type="text"
                  placeholder="write a caption....."
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
