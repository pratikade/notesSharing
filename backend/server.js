// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log("MongoDB Connected"))
// .catch((err) => console.log(err));

// // Routes
// app.get("/", (req, res) => {
//     res.send("API is running...");
// });

// // Example POST route
// const User = require("./model/User");

// app.post("/user", async (req, res) => {
//     try {
//         const user = new User(req.body);
//         await user.save();
//         res.status(201).json(user);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Example GET route
// app.get("/users", async (req, res) => {
//     const users = await User.find();
//     res.json(users);
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX, TXT, and image files are allowed'));
        }
    }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://adepratik063_db_user:sO2gSe5nXCwfhQhx@cluster0.xjqxvbj.mongodb.net/?appName=Cluster0')
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
});

// Import Models - Make sure this path is correct
const Note = require("./model/Note");

// Test route
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});

// Upload route with detailed error handling
app.post("/api/notes/upload", (req, res, next) => {
    console.log("📤 Upload request received");
    console.log("Body:", req.body);
    console.log("Headers:", req.headers);
    next();
}, upload.single('file'), async (req, res) => {
    try {
        console.log("📁 File upload middleware executed");
        
        if (!req.file) {
            console.log("❌ No file in request");
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("✅ File received:", req.file);
        console.log("📝 Form data:", req.body);

        const { name, description, category } = req.body;
        
        // Validate required fields
        if (!name || !description || !category) {
            console.log("❌ Missing fields:", { name, description, category });
            return res.status(400).json({ 
                error: "All fields are required",
                missing: {
                    name: !name,
                    description: !description,
                    category: !category
                }
            });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const note = new Note({
            name: name.trim(),
            description: description.trim(),
            category: category,
            fileName: req.file.originalname,
            fileUrl: fileUrl,
            fileSize: req.file.size,
            downloads: 0
        });

        console.log("💾 Saving note to database:", note);
        const savedNote = await note.save();
        console.log("✅ Note saved successfully:", savedNote);

        res.status(201).json({ 
            success: true, 
            message: "Note uploaded successfully",
            note: savedNote 
        });
        
    } catch (error) {
        console.error("❌ Upload error:", error);
        console.error("Error stack:", error.stack);
        
        // Send detailed error response
        res.status(500).json({ 
            error: error.message,
            details: error.errors || "No additional details"
        });
    }
});

// Get all notes
app.get("/api/notes", async (req, res) => {
    try {
        console.log("📖 Fetching all notes");
        const notes = await Note.find().sort({ createdAt: -1 });
        console.log(`✅ Found ${notes.length} notes`);
        res.json(notes);
    } catch (error) {
        console.error("❌ Error fetching notes:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get notes by category
app.get("/api/notes/category/:category", async (req, res) => {
    try {
        console.log(`📖 Fetching notes for category: ${req.params.category}`);
        const notes = await Note.find({ 
            category: req.params.category 
        }).sort({ createdAt: -1 });
        console.log(`✅ Found ${notes.length} notes`);
        res.json(notes);
    } catch (error) {
        console.error("❌ Error fetching notes by category:", error);
        res.status(500).json({ error: error.message });
    }
});

// Download note
app.put("/api/notes/download/:id", async (req, res) => {
    try {
        console.log(`📥 Incrementing download count for note: ${req.params.id}`);
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            { $inc: { downloads: 1 } },
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json({ success: true, downloads: note.downloads });
    } catch (error) {
        console.error("❌ Error updating download count:", error);
        res.status(500).json({ error: error.message });
    }
});

// Search notes
app.get("/api/notes/search/:query", async (req, res) => {
    try {
        console.log(`🔍 Searching notes for: ${req.params.query}`);
        const notes = await Note.find({
            $or: [
                { name: { $regex: req.params.query, $options: 'i' } },
                { description: { $regex: req.params.query, $options: 'i' } }
            ]
        });
        console.log(`✅ Found ${notes.length} matching notes`);
        res.json(notes);
    } catch (error) {
        console.error("❌ Error searching notes:", error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("🔥 Global error handler:", err);
    res.status(500).json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Test URL: http://localhost:${PORT}/api/test`);
});