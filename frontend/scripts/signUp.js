const signupForm = document.getElementById("signupForm");

// graqphql queries
const hashPassword = `#graphql 
  mutation HashPassword($password: String!) {
    hashPassword(password: $password) {
      hashedPassword
    }
  }
`;

const createNewUser = `#graphql
  mutation NewUser($email: String!, $first_name: String!, $last_name: String!, $password: String!) {
    insert_users(objects: {email: $email, first_name: $first_name, last_name: $last_name, password: $password}) {
        returning {
          user_id
        }
    }
  }
`;

const createNewAccount = `#graphql
  mutation NewAccount($user_id: Int!, $balance: Int = 1000) {
    insert_accounts(objects: {user_id: $user_id, balance: $balance}) {
      returning {
        user_id
        account_id
        balance
      }
    }
  }
`;

// parameters to be passed in at each request
const headers = {
  "x-hasura-admin-secret": "myadminsecretkey",
};
const url = "http://localhost:8080/v1/graphql";
const method = "post";

async function hashPasswordFn(password) {
  try {
    const {
      data: { data },
    } = await axios({
      method,
      url,
      data: {
        query: hashPassword,
        variables: {
          password,
        },
      },
      headers,
    });
    return data.hashPassword.hashedPassword;
  } catch (err) {
    console.log("Error: ", err);
  }
}

async function createUserFn(firstname, lastname, email, hash) {
  try {
    const {
      data: { data },
    } = await axios({
      method,
      url,
      data: {
        query: createNewUser,
        variables: {
          first_name: firstname,
          last_name: lastname,
          email,
          password: hash,
        },
      },
      headers,
    });
    return data.insert_users.returning[0].user_id;
  } catch (err) {
    console.log("Error: ", err);
  }
}

async function newAccountFn(user_id) {
  try {
    const {
      data: { data },
    } = await axios({
      method,
      url,
      data: {
        query: createNewAccount,
        variables: {
          user_id,
        },
      },
      headers,
    });
    console.log(data);
  } catch (err) {
    console.log("Error: ", err);
  }
}

const handleSignup = async (event) => {
  event.preventDefault();

  // fetching all the elements which need to be updated

  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const hash = await hashPasswordFn(password);
    const user_id = await createUserFn(firstname, lastname, email, hash);

    localStorage.setItem("userId", user_id);

    // creating an account for the user with a min balance
    await newAccountFn(user_id);

    // redirecting to the dashboard after succesfull signup
    window.location.assign("dashboard.html");
  } catch (err) {
    console.log("Error: ", err);
  }
};

signupForm.addEventListener("submit", handleSignup);
