
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';

// 1. සියලුම Usersලා Database එකෙන් ලබා ගැනීම
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

export const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Email එක කලින් පාවිච්චි කරලාද බලන්න (Validation)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Password එක Hash කිරීම (ආරක්ෂාවට)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // අලුත් User Object එක සෑදීම
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        // Database එකේ save කිරීම
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

// 3. User කෙනෙක්ව Database එකෙන් ඉවත් කිරීම
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // ID එකට අදාළ User සොයා ඉවත් කිරීම
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};