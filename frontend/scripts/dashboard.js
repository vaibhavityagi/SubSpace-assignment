// graphql queries
const getUserById = `#graphql
query FindUserById($user_id: Int!) {
  users_by_pk(user_id: $user_id) {
    first_name
    last_name
    accounts {
      balance
      account_id
    }
  }
}
`;

const updateBal = `#graphql
mutation PatchBal($_eq: Int!, $balance: Int!) {
  update_accounts(where: {account_id: {_eq: $_eq}}, _set: {balance: $balance}) {
    returning {
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

async function getUserDetails(user_id) {
  try {
    const {
      data: { data },
    } = await axios({
      method,
      url,
      data: {
        query: getUserById,
        variables: {
          user_id,
        },
      },
      headers,
    });
    console.log(data);
    return data.users_by_pk;
  } catch (e) {
    console.log(e);
  }
}

async function updateBalFn(accounId, balance) {
  try {
    const {
      data: { data },
    } = await axios({
      method,
      url,
      data: {
        query: updateBal,
        variables: {
          _eq: accounId,
          balance,
        },
      },
      headers,
    });
    return data.update_accounts.returning[0];
  } catch (e) {
    console.log(e);
  }
}

const handleDeposit = async (event, bal, accId, input, balanceDiv) => {};

document.addEventListener("DOMContentLoaded", async function () {
  // fetching all the elements which need to be updated
  const amtInput = document.getElementById("amount");
  const withdrawBtn = document.getElementById("withdraw-btn");
  const depositBtn = document.getElementById("deposit-btn");
  const userProfile = document.getElementById("user-name");
  const logout = document.getElementById("logout");
  const balanceDiv = document.getElementById("balance");

  const user_id = localStorage.getItem("userId");

  let { accounts, first_name } = await getUserDetails(user_id);

  // dynamic nav bar
  userProfile.innerHTML = first_name[0];

  let bal = accounts[0].balance;
  const accId = accounts[0].account_id;

  balanceDiv.innerHTML = `Your balance: Rs${bal}`;

  withdrawBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const amount = parseInt(amtInput.value);

    if (bal < amount) alert("Cannot withdraw");
    else {
      const { balance: newBal } = await updateBalFn(accId, bal - amount);
      bal = newBal;
      balanceDiv.innerHTML = `Your balance: Rs${newBal}`;
      amtInput.value = "";
    }
  });

  depositBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const amount = parseInt(amtInput.value);

    if (amount <= 0) alert("Enter a number greater than 0");
    else {
      const { balance: newBal } = await updateBalFn(accId, bal + amount);
      bal = newBal;
      balanceDiv.innerHTML = `Your balance: Rs${newBal}`;
      amtInput.value = "";
    }
  });

  logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.assign("signIn.html");
  });
});
