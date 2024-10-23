const mongoose = require('mongoose');
const { Schema } = mongoose;

const AthleteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profileImage: {
        type: String,
    },
    prPoints: {
        type: Number,
        default: 0
    },
    bodyFat: {
        current: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    },
    deadlift: {
        current: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    },
    muscleMass: {
        current: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    },
    benchPress: {
        current: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    },
    shoulders: {
        current: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    },
    squats: {
        current: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    },
    biceps: {
        current: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    },
    chest: {
        current: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    },
    neck: {
        current: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    },
    back: {
        current: {
            type: Number,
            required: true
        },
        goal: {
            type: Number,
            required: true
        }
    },
    achievements: [{
        title: String,
        date: Date
    }],
    activity: {
        walk: {
            steps: Number
        },
        sleep: {
            hours: Number
        },
        heartRate: {
            bpm: Number
        },
        caloriesBurned: {
            kcal: Number
        }
    }
}, { timestamps: true });

const Athlete = mongoose.model('Athlete', AthleteSchema);
module.exports = Athlete;
