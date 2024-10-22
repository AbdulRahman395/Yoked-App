const Athlete = require('../models/Athlete');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

// Controller for handling athlete profile operations
const AthleteProfileController = {

    // 1. Create or Update Athlete Profile
    createOrUpdateProfile: async (req, res) => {
        const { profileImage, bodyFat, deadlift, muscleMass, benchPress, shoulders, squats, biceps, chest, neck, back, achievements } = req.body;

        try {
            // Extract the JWT token from the Authorization header
            const token = req.headers.authorization.split(' ')[1]; // Format: Bearer <token>
            if (!token) {
                return res.status(401).json({ message: "Authorization token is required" });
            }

            // Verify the token and extract the userId
            const decoded = jwt.verify(token, secretKey);
            const userId = decoded._id; // Assuming the token payload contains the user's _id

            // Check if the user exists and is an athlete
            const user = await User.findById(userId);
            if (!user || user.isAthlete !== "Yes") {
                return res.status(403).json({ message: "User is not an athlete or does not exist." });
            }

            // Check if an athlete profile already exists for the user
            let athleteProfile = await Athlete.findOne({ user: userId });

            if (athleteProfile) {
                // Update existing athlete profile
                athleteProfile.profileImage = profileImage || athleteProfile.profileImage;
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
                    profileImage,
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

            return res.status(200).json({ message: "Athlete profile created/updated successfully.", athleteProfile });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // 2. Get Athlete Profile by User ID
    // getAthleteProfile: async (req, res) => {
    //     const { userId } = req.params;

    //     try {
    //         const athleteProfile = await Athlete.findOne({ user: userId }).populate('user', 'fullname username profileImage');
    //         if (!athleteProfile) {
    //             return res.status(404).json({ message: "Athlete profile not found." });
    //         }

    //         // Calculate the percentage for each body stat and achievement count
    //         const calculatePercentage = (current, goal) => (goal ? (current / goal) * 100 : 0).toFixed(2);

    //         const profileWithPercentage = {
    //             ...athleteProfile.toObject(),
    //             user: {
    //                 ...athleteProfile.user,
    //                 fullname: athleteProfile.user.fullname,
    //                 username: athleteProfile.user.username,
    //                 profileImage: athleteProfile.user.profileImage
    //             },
    //             squats: {
    //                 ...athleteProfile.squats,
    //                 percentageAchieved: calculatePercentage(athleteProfile.squats.current, athleteProfile.squats.goal)
    //             },
    //             biceps: {
    //                 ...athleteProfile.biceps,
    //                 percentageAchieved: calculatePercentage(athleteProfile.biceps.current, athleteProfile.biceps.goal)
    //             },
    //             chest: {
    //                 ...athleteProfile.chest,
    //                 percentageAchieved: calculatePercentage(athleteProfile.chest.current, athleteProfile.chest.goal)
    //             },
    //             neck: {
    //                 ...athleteProfile.neck,
    //                 percentageAchieved: calculatePercentage(athleteProfile.neck.current, athleteProfile.neck.goal)
    //             },
    //             back: {
    //                 ...athleteProfile.back,
    //                 percentageAchieved: calculatePercentage(athleteProfile.back.current, athleteProfile.back.goal)
    //             },
    //             achievements: {
    //                 count: athleteProfile.achievements.length
    //             }
    //         };

    //         return res.status(200).json(profileWithPercentage);
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ error: "Internal server error" });
    //     }
    // },

    // 2. Get Athlete Profile by JWT
    getAthleteProfile: async (req, res) => {
        try {
            // Ensure the authorization header is provided
            if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
                return res.status(401).json({ message: "Authorization header missing or malformed." });
            }

            // Extract and verify the JWT token
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            // Log the entire decoded token for debugging
            console.log('Decoded Token:', decodedToken);

            // Try to extract userId from the decoded token
            const userId = decodedToken.userId || decodedToken.id || decodedToken.sub; // Fallback to other fields
            console.log('Extracted userId:', userId);

            if (!userId) {
                return res.status(400).json({ message: "User ID not found in token." });
            }

            // Find the athlete profile and populate the user details
            const athleteProfile = await Athlete.findOne({ user: userId }).populate('user', 'fullname username profileImage');

            // Log the athleteProfile for debugging
            console.log('Athlete Profile:', athleteProfile);

            if (!athleteProfile) {
                return res.status(404).json({ message: "Athlete profile not found." });
            }

            // Helper function to calculate percentage
            const calculatePercentage = (current, goal) => (goal ? ((current / goal) * 100).toFixed(2) : 0);

            // Structure the response with percentages and achievement count
            const profileWithPercentage = {
                ...athleteProfile.toObject(),
                user: {
                    fullname: athleteProfile.user.fullname,
                    username: athleteProfile.user.username,
                    profileImage: athleteProfile.user.profileImage
                },
                squats: {
                    ...athleteProfile.squats,
                    percentageAchieved: calculatePercentage(athleteProfile.squats.current, athleteProfile.squats.goal)
                },
                biceps: {
                    ...athleteProfile.biceps,
                    percentageAchieved: calculatePercentage(athleteProfile.biceps.current, athleteProfile.biceps.goal)
                },
                chest: {
                    ...athleteProfile.chest,
                    percentageAchieved: calculatePercentage(athleteProfile.chest.current, athleteProfile.chest.goal)
                },
                neck: {
                    ...athleteProfile.neck,
                    percentageAchieved: calculatePercentage(athleteProfile.neck.current, athleteProfile.neck.goal)
                },
                back: {
                    ...athleteProfile.back,
                    percentageAchieved: calculatePercentage(athleteProfile.back.current, athleteProfile.back.goal)
                },
                achievements: {
                    count: athleteProfile.achievements ? athleteProfile.achievements.length : 0
                }
            };

            // Return the response
            return res.status(200).json(profileWithPercentage);
        } catch (error) {
            console.error('Error:', error);
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Invalid or expired token." });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    // 3. Update Athlete Profile
    updateAthleteProfile: async (req, res) => {
        const { userId } = req.params;
        const updates = req.body;

        try {
            const athleteProfile = await AthleteProfile.findOneAndUpdate({ user: userId }, updates, { new: true });
            if (!athleteProfile) {
                return res.status(404).json({ message: "Athlete profile not found." });
            }

            return res.status(200).json({ message: "Athlete profile updated successfully.", athleteProfile });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // 4. Delete Athlete Profile
    deleteAthleteProfile: async (req, res) => {
        const { userId } = req.params;

        try {
            const athleteProfile = await AthleteProfile.findOneAndDelete({ user: userId });
            if (!athleteProfile) {
                return res.status(404).json({ message: "Athlete profile not found." });
            }

            // Remove the reference from the user document
            await User.findByIdAndUpdate(userId, { athleteProfile: null });

            return res.status(200).json({ message: "Athlete profile deleted successfully." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // 5. Get All Athlete Profiles
    getAllAthleteProfiles: async (req, res) => {
        try {
            const athleteProfiles = await AthleteProfile.find().populate('user', 'fullname username profileImage');
            return res.status(200).json(athleteProfiles);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = AthleteProfileController;
