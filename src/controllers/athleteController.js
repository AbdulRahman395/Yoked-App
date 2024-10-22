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
