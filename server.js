const express = require("express");
const app = express();
const casbin = require("casbin");

const startServer = async () => {
  // Load the Casbin model and policy
  const enforcer = await casbin.newEnforcer(
    "basic_model.conf",
    "basic_policy.csv"
  );

  app.get("/", (req, res) => {
    res.send("You're in!");
  });

  app.get("/protected", async (req, res) => {
    // Check if the user is authorized
    const authorized = await enforcer.enforce("alice", "data1", "update");
    // You're in!

    // Kondisi tidak sesuai
    // const authorized = await enforcer.enforce("alice", "data1", "delete");
    // Result : Not Authorized

    if (!authorized) {
      res.status(403).send("Not Authorized");
    } else {
      res.send("You're in!");
    }
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
