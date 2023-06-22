import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  //to update
  let [value, setValue] = useState([]);
  let [text, setText] = useState("");
  let [show, setShow] = useState(false);
  let [item, setItem] = useState([]);

  let navigate = useNavigate();

  //to get the email and token from session storage
  let email = sessionStorage.getItem("email");
  let token = sessionStorage.getItem("token");

  //to display the default profile pic
  let picLink =
    "https://img.freepik.com/premium-vector/avatar-profile-icon_188544-4755.jpg";

  //to show and hide comments
  const toggleComment = (e) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(e);
    }
  };

  //get all post
  const getPosts = async () => {
    try {
      let response = await axios.get(`${url}/users/post-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setValue(response.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  //function to like post
  const likePost = async (id) => {
    try {
      let like = await axios.put(
        `${url}/users/like-post`,
        { id, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (like.status === 200) {
        let newData = value.map((post) => {
          //post._id depicts the image id and like.data.like.._id depicts the img id where the like is given
          if (post._id === like.data.like._id) {
            //like.data.like depicts the id of the user who has given the like
            return like.data.like;
          } else {
            return post;
          }
        });
        //update state for like post
        setValue(newData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //function to unlike post
  const unLikePost = async (id) => {
    try {
      let unLike = await axios.put(
        `${url}/users/unLike-post`,
        { id, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (unLike.status === 200) {
        let newData = value.map((post) => {
          if (post._id === unLike.data.unLike._id) {
            return unLike.data.unLike;
          } else {
            return post;
          }
        });
        //update state for unlike post
        setValue(newData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //function to comment post
  const handleComment = async (id) => {
    try {
      let response = await axios.put(
        `${url}/users/comment-post`,
        { text, email, id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        let newData = value.map((post) => {
          //both depicts the img id
          if (post._id === response.data.commentDetails._id) {
            return response.data.commentDetails;
          } else {
            return post;
          }
        });
        //update state for comments
        setValue(newData);
        toast.success(response.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //to pre-populate the post
  useEffect(() => {
    getPosts();
  }, []);

  //if the post is not empty
  if (setValue !== []) {
    return (
      <div className="d-flex justify-content-center mt-5 home-page">
        <div>
          {/* to display all the posts */}
          {value.map((e, i) => {
            return (
              <div className="home" key={i}>
                {/* card */}
                <div className="card-home">
                  {/* card header */}
                  <div className="card-header-home d-flex">
                    <div className="card-pic">
                      <img
                        src={e.profile_pic ? e.profile_pic : picLink}
                        alt=""
                        width="40"
                        height="40"
                        className="rounded-circle"
                      />
                    </div>

                    <h6
                      className="pt-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/profile/${e.email}`)}
                    >
                      {e.name}
                    </h6>
                  </div>

                  {/* card image */}
                  <div className="card-image">
                    <img src={e.image} alt="" />
                  </div>

                  {/* card content */}
                  <div className="card-content">
                    {e.likes.includes(
                      JSON.parse(sessionStorage.getItem("user"))._id
                    ) ? (
                      <span
                        className="material-symbols-outlined material-symbols-outlined-red"
                        onClick={() => unLikePost(e._id)}
                      >
                        favorite
                      </span>
                    ) : (
                      <span
                        className="material-symbols-outlined"
                        onClick={() => likePost(e._id)}
                      >
                        favorite
                      </span>
                    )}
                    <p>{e.likes.length} Likes</p>
                    <p>{e.text}</p>
                    <p
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => toggleComment(e)}
                    >
                      View all comments
                    </p>
                  </div>

                  {/* add comment */}
                  <div className="add-comment">
                    <span className="material-symbols-outlined">mood</span>
                    <input
                      type="text"
                      placeholder="add a comment"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <button
                      className="comment"
                      onClick={() => handleComment(e._id)}
                    >
                      post
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* show comments */}

          {show && (
            <div className="showComment">
              <div className="comment-container">
                <div className="postPic">
                  <img
                    src={item.image}
                    style={{ width: "38em", height: "30em", padding: "5px" }}
                    alt=""
                  />
                </div>

                <div className="details">
                  {/* card header */}
                  <div className="card-header-home d-flex">
                    <div className="card-pic pb-2">
                      <img
                        src={item.profile_pic ? item.profile_pic : picLink}
                        alt=""
                        width="40"
                        height="40"
                        className="rounded-circle"
                      />
                    </div>
                    <h6 className="pt-2">{item.name}</h6>
                  </div>

                  {/* card section */}
                  <div className="comment-section">
                    {/* comments show */}
                    <div className="comment-read">
                      {item.comments.map((e) => {
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
                          <p>{item.likes.length} likes</p>
                          <p>{item.text}</p>
                        </div>

                        {/* add comment */}
                        <div className="add-comment-show">
                          <span className="material-symbols-outlined">
                            mood
                          </span>
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* close comment */}
              <div className="close-comment">
                <span
                  class="material-symbols-outlined"
                  onClick={() => toggleComment()}
                >
                  cancel
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else <div>loading</div>;
}

export default Home;
