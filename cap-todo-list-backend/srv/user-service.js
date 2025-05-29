const { User } = require("@sap/cds");
const cds = require("@sap/cds");
const { string } = require("@sap/cds/lib/core/classes");
const bcrypt = require("bcrypt");

// the UserService class
class UserService extends cds.ApplicationService {
  async init() {
    const db = await cds.connect.to("db");
    const { Tasks, User } = this.entities;

    // sets the done property of the task associated with the passed id accordingly (used for the do_Task function)
    this.on("doTask", async (req) => {
      const { task, done } = req.data;
      // updates associated task
      const n = await UPDATE(Tasks, task).with({ done: done });
    });

    // creates an new task with the passed user and title (used for the add_Task function)
    this.on("createTask", async (req) => {
      const { user, title } = req.data;
      // gets task with the bigges ID
      const result = await SELECT.one
        .from(Tasks)
        .columns("ID")
        .orderBy("ID desc");
      const lastTask = result?.ID ?? 0;
      // creates new task with the next ID and the passed propertys
      const n = await this.create(Tasks).entries({
        ID: lastTask + 1,
        user_ID: user,
        title: title,
        done: false,
      });
    });

    // returns all tasks associated with one passed user (used for the update_Tasks funktion)
    this.on("getTasks", async (req) => {
      const { user } = req.data;
      const user_tasks = await SELECT.from("Tasks").where({ user_ID: user });
      return user_tasks;
    });

    // authenticates the user if username and password are correct (used in the login page)
    this.on('login', async (req) => {
        const { username, password } = req.data;
        // get user with same username
        const user = await SELECT.one.from(User).where({ username });
        // check if username is existend
        if (!user) return req.reject(401, "User not found");
        // checks if the passwords are the same (hashed)
        const match = await bcrypt.compare(password, user.password);
        // if passwords don't match return Invalid password
        if (!match) return req.reject(401, "Invalid password");
        // if password is correct return the user ID
        return user.ID;
      });

    // registers an new user with passed password and username (used in the register page)
    this.on("register", async (req) => {
      const { username, password } = req.data;
      // checks if and username and password got passed
      if (!username || !password) {
        return req.reject(400, "Username and password are required");
      }
      // checks if the username is already existend
      const existing = await SELECT.one.from(User).where({ username });
      if (existing) return req.reject(409, "Username already exists");
      // creates new user with the hashed password 
      const hashed = await bcrypt.hash(password, 10);
      const result = await INSERT.into(User).entries({
        username,
        password: hashed,
      });
      // returns user ID
      const n = await SELECT.one.from(User).where({username});
      return n.ID
    });

    return super.init();
  }
}

module.exports = UserService;
