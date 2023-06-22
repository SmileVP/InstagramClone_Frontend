//condition based on token
export const isAuthenticated = () => {
  if (sessionStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
};

//to get the profilePic from session storage
export const profilePic = () => {
  let pic = sessionStorage.getItem("photo");
  return pic;
};
