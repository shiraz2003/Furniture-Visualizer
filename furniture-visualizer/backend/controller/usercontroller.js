import User from "../model/usermodel.js";

export function createUser(req, res) {
  const user = new User(req.body);
  user
    .save()
    .then(() => res.status(201).json({ message: "User created successfully" }))
    .catch((error) =>
      res.status(400).json({
        message: "Error creating user",
        error: error.message,
      }),
    );
}
