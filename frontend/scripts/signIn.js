// fetching all the elements which need to be updated
const signinForm = document.getElementById("signinForm");

// graqphql queries
const getUser = `#graphql
  query GetUser($_eq: String!) {
    users(where: {email: {_eq: $_eq}}) {
      password
      user_id
    }
  }
`;

const verifyPass = `#graphql
  mutation VerifyUser($hashedPassword: String!, $plainPassword: String!) {
    verifyPassword(hashedPassword: $hashedPassword, plainPassword: $plainPassword) {
      plainPassword
    }
  }
`;

// parameters to be passed in at each request
const headers = {
  "x-hasura-admin-secret": "myadminsecretkey",
};
const url = "http://localhost:8080/v1/graphql";
const method = "post";

async function getUserFn(email) {
  try {
    const {
      data: { data },
    } = await axios({
      method,
      url,
      data: {
        query: getUser,
        variables: {
          _eq: email,
        },
      },
      headers,
    });
    return data.users[0];
  } catch (err) {
    console.log("Error: ", err);
  }
}

async function verifyUserfn(hash, password) {
  try {
    const {
      data: { data },
    } = await axios({
      method,
      url,
      data: {
        query: verifyPass,
        variables: {
          hashedPassword: hash,
          plainPassword: password,
        },
      },
      headers,
    });
    return data.verifyPassword.plainPassword;
  } catch (err) {
    console.log("Error: ", err);
  }
}

const handleSignin = async (event) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  event.preventDefault();

  const { password: hash, user_id } = await getUserFn(email);
  const verifiedPass = await verifyUserfn(hash, password);

  if (verifiedPass == password) {
    localStorage.setItem("userId", user_id);

    // redirecting to the dashboard upon successful login
    window.location.assign("dashboard.html");
  } else alert("Invalid Inputs");
};

signinForm.addEventListener("submit", handleSignin);
