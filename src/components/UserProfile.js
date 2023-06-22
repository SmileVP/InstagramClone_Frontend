import React, { useEffect, useState } from "react";
import { url } from "../App";
import axios from "axios";
import { useParams } from "react-router-dom";

function UserProfile() {
  let picLink =
    "https://img.freepik.com/premium-vector/avatar-profile-icon_188544-4755.jpg";

  // received params for user email
  let { email } = useParams();

  //login person email
  let personEmail = sessionStorage.getItem("email");

  let [pic, setPic] = useState([]);
  let [user, setUser] = useState([]);
  let [isFollow, setIsFollow] = useState(false);

  let data = JSON.parse(sessionStorage.getItem("user"));
  let token = sessionStorage.getItem("token");

  //function for follow user
  const handleFollowUser = async (userId) => {
    try {
      let res = await axios.put(
        `${url}/follow`,
        {
          personEmail,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //checks the id of one who has followed with the person who has logged in
      if (res.data.followDetails.followers.includes(data._id)) {
        setIsFollow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //function for unFollow user
  const handleUnFollowUser = async (userId) => {
    try {
      let res = await axios.put(
        `${url}/unFollow`,
        {
          personEmail,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setIsFollow(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get profile information of the login user
  const profileDetails = async () => {
    try {
      let res = await axios.get(`${url}/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
      setPic(res.data.post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    profileDetails();
  }, [isFollow]);

  return (
    <div className="d-flex justify-content-center">
      <div className="profile">
        {/* profile frame */}
        <div className="profile-frame">
          {/* profile pic */}
          <div className="profile-pic">
            <img src={user.photo ? user.photo : picLink} alt="" />
          </div>

          {/* profile data */}
          <div className="profile-data">
            <div className="d-flex align-items-center justify-content-between">
              <h1>{user.fullName}</h1>
              <button
                className="followBtn"
                onClick={() => {
                  if (isFollow) {
                    handleUnFollowUser(user._id);
                  } else {
                    //user.id depicts the person who has posted
                    handleFollowUser(user._id);
                  }
                }}
              >
                {isFollow ? "Unfollow" : "follow"}
              </button>
              &nbsp;
            </div>
            <div className="profile-info p-3 d-flex ">
              <p> {pic ? pic.length : "0"} posts</p>
              <p>{user.followers ? user.followers.length : "0"} followers</p>
              <p> {user.following ? user.following.length : "0"} following</p>
            </div>
          </div>
        </div>

        <hr
          style={{
            width: "100%",
            opacity: "0.8",
            margin: "25px auto",
          }}
        />

        <div className="gallery">
          {pic.map((value) => {
            return (
              <>
                <img key={value._id} src={value.image} alt="" />
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
