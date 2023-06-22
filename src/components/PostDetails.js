import axios from "axios";
import React from "react";
import { url } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

//post,user,toggleDetails as props
function PostDetails(props) {
  let navigate = useNavigate();

  let token = sessionStorage.getItem("token");

  //function for deleting the post
  const handleDeletePost = async (postId) => {
    try {
      if (window.confirm("Do you really want to delete this post ?")) {
        let res = await axios.delete(`${url}/users/delete-post/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          props.toggleDetails();
          toast.success(res.data.message);
          navigate("/home");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="showComment">
      <div className="comment-container">
        <div className="postPic">
          <img
            src={props.item.image}
            style={{ width: "38em", height: "30em", padding: "5px" }}
            alt=""
          />
        </div>

        <div className="details">
          {/* card header */}
          <div className="card-header-home d-flex">
            <div className="card-pic pb-2">
              <img
                src={props.user.photo}
                alt=""
                width="40"
                height="40"
                className="rounded-circle"
              />
            </div>
            <h6 className="pt-2">{props.item.name}</h6>
            <div className="delete-post">
              <span
                class="material-symbols-outlined"
                onClick={() => handleDeletePost(props.item._id)}
              >
                delete
              </span>
            </div>
          </div>

          {/* card section */}
          <div className="comment-section">
            {/* comments show */}
            <div className="comment-read">
              {props.item.comments.map((e) => {
                return (
                  <p className="comm">
                    <span className="commenter">
                      <b>{e.name}</b>{" "}
                    </span>
                    {"- "}
                    <span className="commentText">{e.comment}</span>
                  </p>
                );
              })}
            </div>

            <div className="comment-content-bottom">
              <div>
                {/* card content */}
                <div
                  className="card-content"
                  style={{ borderTop: "1px solid lightgray" }}
                >
                  <p>{props.item.likes.length} likes</p>
                  <p>{props.item.text}</p>
                </div>
                {/* add comment */}
                {/* <div className="add-comment-show">
                  <span className="material-symbols-outlined">mood</span>
                  <input
                    type="text"
                    placeholder="add a comment"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    className="comment"
                    onClick={() => {
                      handleComment(item._id);
                      toggleComment();
                    }}
                  >
                    post
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* close comment */}
      <div className="close-comment">
        <span
          class="material-symbols-outlined"
          onClick={() => props.toggleDetails()}
        >
          cancel
        </span>
      </div>
    </div>
  );
}

export default PostDetails;
