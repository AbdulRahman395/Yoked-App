const Athlete = require('../models/Athlete');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

// Controller for handling athlete profile operations
const AthleteProfileController = {
    // 1. Create or Update Athlete Profile
    createProfile: async (req, res) => {
        try {
            const {
                bodyFat,
                deadlift,
                muscleMass,
                benchPress,
                shoulders,
                squats,
                biceps,
                chest,
                neck,
                back,
                achievements
            } = req.body;

            const profileImage = req.file;

            // Extract the JWT
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Verify and extract userId
            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const userId = decoded._id;
            if (!userId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Validate required fields
            if (
                !bodyFat || !bodyFat.current || !bodyFat.goal ||
                !deadlift || !deadlift.current || !deadlift.goal ||
                !muscleMass || !muscleMass.current || !muscleMass.goal ||
                !benchPress || !benchPress.current || !benchPress.goal ||
                !shoulders || !shoulders.current || !shoulders.goal ||
                !squats || !squats.current || !squats.goal ||
                !biceps || !biceps.current || !biceps.goal ||
                !chest || !chest.current || !chest.goal ||
                !neck || !neck.current || !neck.goal ||
                !back || !back.current || !back.goal ||
                !profileImage
            ) {
                return res.status(400).json({ message: 'All fields and profile image are required' });
            }

            // Handle the profile image file upload
            const profileImagePath = profileImage.filename;

            // Check if the user exists and is an athlete
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.isAthlete !== "Yes") {
                return res.status(403).json({ message: "User is not an athlete" });
            }

            // Check if an athlete profile already exists for the user
            let athleteProfile = await Athlete.findOne({ user: userId });

            if (athleteProfile) {
                // Update existing athlete profile
                athleteProfile.profileImage = profileImagePath || athleteProfile.profileImage;
                athleteProfile.bodyFat = bodyFat || athleteProfile.bodyFat;
                athleteProfile.deadlift = deadlift || athleteProfile.deadlift;
                athleteProfile.muscleMass = muscleMass || athleteProfile.muscleMass;
                athleteProfile.benchPress = benchPress || athleteProfile.benchPress;
                athleteProfile.shoulders = shoulders || athleteProfile.shoulders;
                athleteProfile.squats = squats || athleteProfile.squats;
                athleteProfile.biceps = biceps || athleteProfile.biceps;
                athleteProfile.chest = chest || athleteProfile.chest;
                athleteProfile.neck = neck || athleteProfile.neck;
                athleteProfile.back = back || athleteProfile.back;
                athleteProfile.achievements = achievements || athleteProfile.achievements;
            } else {
                // Create a new athlete profile
                athleteProfile = new Athlete({
                    user: userId,
                    profileImage: profileImagePath,
                    bodyFat,
                    deadlift,
                    muscleMass,
                    benchPress,
                    shoulders,
                    squats,
                    biceps,
                    chest,
                    neck,
                    back,
                    achievements
                });
            }

            await athleteProfile.save();

            // Link the athlete profile to the user
            if (!user.athleteProfile) {
                user.athleteProfile = athleteProfile._id;
                await user.save();
            }

            res.status(201).send({ message: "Athlete profile created successfully", athleteProfile });
        } catch (error) {
            console.error("Error creating/updating athlete profile:", error);
            res.status(500).json({ message: 'Error creating/updating athlete profile' });
        }
    },

    // 2. Get Athlete Profile by User ID
    getAthleteProfile: async (req, res) => {
        const { userId } = req.params;

        try {
            const athleteProfile = await Athlete.findOne({ user: userId })
                .populate('user', 'fullname username profileImage');

            if (!athleteProfile) {
                return res.status(404).json({ message: "Athlete profile not found." });
            }

            // Function to calculate the percentage of goal achieved
            const calculatePercentage = (current, goal) => (goal ? ((current / goal) * 100).toFixed(2) : 0);

            // Prepare the profile data with percentages and achievements count
            const profileWithPercentage = {
                _id: athleteProfile._id,
                user: {
                    _id: athleteProfile.user._id,
                    fullname: athleteProfile.user.fullname,
                    username: athleteProfile.user.username
                },
                profileImage: athleteProfile.profileImage,
                prPoints: athleteProfile.prPoints,
                bodyFat: athleteProfile.bodyFat,
                deadlift: athleteProfile.deadlift,
                muscleMass: athleteProfile.muscleMass,
                benchPress: athleteProfile.benchPress,
                shoulders: athleteProfile.shoulders,
                squats: {
                    current: athleteProfile.squats.current,
                    goal: athleteProfile.squats.goal,
                    percentage: calculatePercentage(athleteProfile.squats.current, athleteProfile.squats.goal)
                },
                biceps: {
                    current: athleteProfile.biceps.current,
                    goal: athleteProfile.biceps.goal,
                    percentage: calculatePercentage(athleteProfile.biceps.current, athleteProfile.biceps.goal)
                },
                chest: {
                    current: athleteProfile.chest.current,
                    goal: athleteProfile.chest.goal,
                    percentage: calculatePercentage(athleteProfile.chest.current, athleteProfile.chest.goal)
                },
                neck: {
                    current: athleteProfile.neck.current,
                    goal: athleteProfile.neck.goal,
                    percentage: calculatePercentage(athleteProfile.neck.current, athleteProfile.neck.goal)
                },
                back: {
                    current: athleteProfile.back.current,
                    goal: athleteProfile.back.goal,
                    percentage: calculatePercentage(athleteProfile.back.current, athleteProfile.back.goal)
                },
                achievements: {
                    count: athleteProfile.achievements.length
                },
                followers: athleteProfile.followers,
                following: athleteProfile.following,
                activity: athleteProfile.activity,
                createdAt: athleteProfile.createdAt,
                updatedAt: athleteProfile.updatedAt
            };

            return res.status(200).json(profileWithPercentage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // 3. Get Athlete Profile by JWT
    getMyAthleteProfile: async (req, res) => {
        try {

            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Extract userId from the decoded token
            const userId = decoded._id;

            const athleteProfile = await Athlete.findOne({ user: userId })
                .populate('user', 'fullname username profileImage');

            if (!athleteProfile) {
                return res.status(404).json({ message: "Athlete profile not found." });
            }

            // Calculate Percentage
            const calculatePercentage = (current, goal) => (goal ? ((current / goal) * 100).toFixed(2) : 0);

            // Prepare the profile data with percentages and achievements count
            const profileWithPercentage = {
                _id: athleteProfile._id,
                user: {
                    _id: athleteProfile.user._id,
                    fullname: athleteProfile.user.fullname,
                    username: athleteProfile.user.username
                },
                profileImage: athleteProfile.profileImage,
                prPoints: athleteProfile.prPoints,
                bodyFat: athleteProfile.bodyFat,
                deadlift: athleteProfile.deadlift,
                muscleMass: athleteProfile.muscleMass,
                benchPress: athleteProfile.benchPress,
                shoulders: athleteProfile.shoulders,
                squats: {
                    current: athleteProfile.squats.current,
                    goal: athleteProfile.squats.goal,
                    percentage: calculatePercentage(athleteProfile.squats.current, athleteProfile.squats.goal)
                },
                biceps: {
                    current: athleteProfile.biceps.current,
                    goal: athleteProfile.biceps.goal,
                    percentage: calculatePercentage(athleteProfile.biceps.current, athleteProfile.biceps.goal)
                },
                chest: {
                    current: athleteProfile.chest.current,
                    goal: athleteProfile.chest.goal,
                    percentage: calculatePercentage(athleteProfile.chest.current, athleteProfile.chest.goal)
                },
                neck: {
                    current: athleteProfile.neck.current,
                    goal: athleteProfile.neck.goal,
                    percentage: calculatePercentage(athleteProfile.neck.current, athleteProfile.neck.goal)
                },
                back: {
                    current: athleteProfile.back.current,
                    goal: athleteProfile.back.goal,
                    percentage: calculatePercentage(athleteProfile.back.current, athleteProfile.back.goal)
                },
                achievements: {
                    count: athleteProfile.achievements.length
                },
                followers: athleteProfile.followers,
                following: athleteProfile.following,
                activity: athleteProfile.activity,
                createdAt: athleteProfile.createdAt,
                updatedAt: athleteProfile.updatedAt
            };

            return res.status(200).json(profileWithPercentage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // 4. Update Athlete Profile
    updateProfile: async (req, res) => {
        try {
            const { bodyFat, deadlift, muscleMass, benchPress, shoulders, squats, biceps, chest, neck, back, achievements } = req.body;
            const profileImage = req.file;

            // Extract the JWT
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Verify and extract userId
            let decoded;
            try {
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const userId = decoded._id;
            if (!userId) {
                return res.status(401).json({ message: "Invalid token, userId missing" });
            }

            // Check if the user exists and is an athlete
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.isAthlete !== "Yes") {
                return res.status(403).json({ message: "User is not an athlete" });
            }

            // Fetch the athlete profile
            const athleteProfile = await Athlete.findOne({ user: userId });
            if (!athleteProfile) {
                return res.status(404).json({ message: "Athlete profile not found" });
            }

            // Update athlete profile fields
            athleteProfile.profileImage = profileImage?.filename || athleteProfile.profileImage;
            athleteProfile.bodyFat = bodyFat || athleteProfile.bodyFat;
            athleteProfile.deadlift = deadlift || athleteProfile.deadlift;
            athleteProfile.muscleMass = muscleMass || athleteProfile.muscleMass;
            athleteProfile.benchPress = benchPress || athleteProfile.benchPress;
            athleteProfile.shoulders = shoulders || athleteProfile.shoulders;
            athleteProfile.squats = squats || athleteProfile.squats;
            athleteProfile.biceps = biceps || athleteProfile.biceps;
            athleteProfile.chest = chest || athleteProfile.chest;
            athleteProfile.neck = neck || athleteProfile.neck;
            athleteProfile.back = back || athleteProfile.back;
            athleteProfile.achievements = achievements || athleteProfile.achievements;

            await athleteProfile.save();

            res.status(200).json({ message: "Athlete profile updated successfully", athleteProfile });
        } catch (error) {
            console.error("Error updating athlete profile:", error);
            res.status(500).json({ message: 'Error updating athlete profile' });
        }
    },

    // 5. Delete Athlete Profile
    deleteAthleteProfile: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Extract userId from the decoded token
            const userId = decoded._id;

            const athleteProfile = await Athlete.findOneAndDelete({ user: userId });

            if (!athleteProfile) {
                return res.status(404).json({ message: "Athlete profile not found." });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            // Set isAthlete to "No"
            user.isAthlete = "No";
            await user.save();

            return res.status(200).json({ message: "Athlete profile deleted successfully." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },
};

module.exports = AthleteProfileController;
