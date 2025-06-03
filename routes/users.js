// import express from "express";
// const router = express.Router();
// import Card from "../models/Student.js";
// import bcrypt from "bcryptjs";
// import upload from "../middleware/upload.js";

// router.get("/api/cards/", async (req,res) => {
//     try {
//         const {limit} = req.query;
//         const hasInvalidQuery = Object.keys(req.query).some(
//             (key) => key !== "limit"
//         );

//         if (hasInvalidQuery) {
//             return res.status(400).json({message: "Invalid query parameter/ give query as limit"})
//         }

//         if(!limit) {
//             const allCards = await Card.find();
//             return res.status(200).json(allCards);
//         }

//         const parsedLimit = Number(limit);
//         if (isNaN(parsedLimit) || parsedLimit <= 0) {
//             return res.status(404).json({
//                 message : "query limit should be a number and it should be more than 0"
//             })        
//         }

//         const totalCards = await Card.countDocuments();

//         if(parsedLimit > totalCards){
//             return res.status(404).json({message : `There are only ${totalCards} cards`});
//         }

//         const limitedCards = await Card.find().limit(parsedLimit);
//         return res.status(200).json(limitedCards);
//     } catch (error){
//         res.status(500).json({message : `Error fetching cards ${error}`})
//     }
// });

// router.get("/api/cards/:id", async (req,res) => {
//     try{
//         const card = await Card.findById(req.params.id);

//         if(card){
//             res.status(200).json(card);
//         }else{
//             res.status(404).json({message: `Card with ID ${req.params.id} not found`})
//         }
//     }catch(error){
//         res.status(500).json({ message: `Error fetching cards, ${error}`})
//     }
// });


// router.post("/api/cards/", upload.single("image"), async (req, res) => {
//     const { username, password, email, gender, age, contact } = req.body;
//     try {
//         const existingUser = await Card.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ message: "Username already exists" });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newCard = new Card({
//             username,
//             password: hashedPassword,
//             email,
//             gender,
//             age: Number(age),
//             contact: Number(contact),
//             image: req.file ? req.file.filename : "",
//         });
// console.log("Received file:", req.file);
// console.log("Received data:", req.body);
//         const savedCard = await newCard.save();
//         res.status(200).json(savedCard);
//     } catch (error) {
//         res.status(500).json({ message: `Error creating new card: ${error}` });
//     }
// });

// router.put("/api/cards/:id", async (req,res)=> {
//     try{
//         const updateData = {...req.body};
//         if(updateData){
//             const salt = await bcrypt.genSalt(10);
//             updateData.password = await bcrypt.hash(updateData.password, salt)
//         }

//         const updatedCard = await Card.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             {new: true}
//         );

//         if (updatedCard){
//             res.status(200).json(updatedCard)
//         }else{
//             res.status(400).json({message: `Card with ID ${req.params.id} not found`})
//         }
//     }catch(error){
//         res.status(500).json({message: `Error editing cards, ${error}`});
//     }
// });

// router.delete("/api/cards/:id", async (req, res)=> {
//     const deletedCard = await Card.findByIdAndDelete(req.params.id);

//     if(deletedCard){
//         res.status(200).json({message: `Card with id ${req.params.id} deleted`})
//     }else{
//         res.status(404).json({message: `Card with ID ${req.params.id} not found`})
//     }
// })





// router.post("/api/cards/login/", async (req,res)=> {
//   try{
//     const {username, password} = req.body;
//     const card = await Card.findOne({ username });

//     if(!card) {
//       return res.status(404).json({message: `Card ${username} not found`});
//     }

//     const isMatch = await bcrypt.compare(password, card.password);
//     if(!isMatch){
//       return res.status(404).json({message: "invalid password"});
//     }
//      res.status(200).json({message: `login successfull`, card});
//   }catch (error){
//     res.status(500).json({message: `Login error ${error}`})
//   }
// })

// export default router;



import express from "express";
import bcrypt from "bcryptjs";
import upload from "../middleware/upload.js";
import User from "../models/User.js";

const router = express.Router();

// GET all students (optional limit)
router.get("/api/getUsers", async (req, res) => {
  try {
    const { limit } = req.query;
    const queryLimit = limit ? parseInt(limit) : null;

    const users = queryLimit
      ? await User.find().limit(queryLimit)
      : await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users: " + error });
  }
});

// GET student by ID
router.get("/api/getUsers/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error: " + error });
  }
});

// REGISTER student
router.post("/api/getUsers", upload.single("image"), async (req, res) => {
  try {
    const { username, password, age, gender, email } = req.body;

    // Validate required fields
    if (!username || !password || !age || !gender || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicates by email or studentName
    const existing = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existing) {
      return res.status(400).json({
        message: "Student with this roll number or name already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const newUser = new User({
      username,
      password: hashedPassword,
      age: Number(age),
      gender,
      email,
      image: req.file ? req.file.filename : "",
    });

    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate entry (roll number or name)" });
    }
    res.status(500).json({ message: "Error creating user: " + error });
  }
});

// LOGIN student
router.post("/api/getUsers/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Login error: " + error });
  }
});

// UPDATE student
router.put("/api/getUsers/:id", async (req, res) => {
  try {
    const update = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Update error: " + error });
  }
});

// DELETE student
router.delete("/api/sgetUsers/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete error: " + error });
  }
});

export default router;
